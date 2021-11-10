const functions = require("firebase-functions");
const admin = require("firebase-admin")
const app = admin.initializeApp();
const firestore = admin.firestore();
const cors = require('cors')({origin: true});
const Config = require('./config');
const nodemailer = require("nodemailer");


// Stripe
const stripe = require('stripe')(Config.stripe_private_key);

// Mailer
// var transport = {
//   host: Config.mailer_host,
//   port: Config.mailer_port,
//   secure: true,
//   auth: {
//     user: Config.mailer_user,
//     pass: Config.mailer_pass
//   }
// }

var transport = {
  host: Config.mailer_host,
  port: Config.mailer_port,
  secure: true,
  auth: {
    type: "OAuth2",
    user: Config.mailer_user,
    clientId: Config.mailer_client_id,
    clientSecret: Config.mailer_client_secret,
    refreshToken: Config.mailer_refresh_token,
  },
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Setting Mailer Success!');
  }
});


exports.createPaymentIntentByCustomer = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const amount = request.query.amount;
    const user_id = request.query.user_id;
    if(!user_id || !amount){
      return response.status(500).send('invalid params');
    }

    const userSnap = await firestore.collection('User').doc(user_id).get();
    const user = userSnap.data();
    try {
      const paymentIntent =
        await stripe.paymentIntents.create({
          payment_method_types: ['card'],
          amount: amount * 100,
          currency: 'usd',
          customer: user.stripe_customer_id,
          payment_method: user.payment_method_id,
          confirm: true
        });
      return response.send(JSON.stringify(paymentIntent));
    } catch (error) {
      return response.status(500).send(error.message);
    }
  })
});

exports.createPaymentIntent = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const amount = request.query.amount;
    if(!amount){
      return response.status(500).send('invalid params');
    }
    try {
      const paymentIntent =
        await stripe.paymentIntents.create({
          payment_method_types: ['card'],
          amount: amount * 100,
          currency: 'usd'
        });
      return response.send(JSON.stringify(paymentIntent));
    } catch (error) {
      return response.status(500).send(error.message);
    }
  })
});

exports.createCustomer = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const user_id = request.query.user_id;
    if(!user_id){
      return response.status(500).send('invalid params');
    }

    const userSnap = await firestore.collection('User').doc(user_id).get();
    const user = userSnap.data();

    try {
      let customerInfo = null;
      if(!user.stripe_customer_id){
        customerInfo =
          await stripe.customers.create({
            name: user.displayName,
            email: user.email,
            payment_method: user.payment_method_id
          });
        await firestore.collection('User').doc(user_id).update({stripe_customer_id: customerInfo.id});
      } else {
        await stripe.paymentMethods.attach(user.payment_method_id, {customer: user.stripe_customer_id});
        customerInfo = await stripe.customers.update(user.stripe_customer_id, {invoice_settings: {default_payment_method: user.payment_method_id}});
      }

      return response.send(JSON.stringify(customerInfo));
    } catch (error) {
      return response.status(500).send(error.message);
    }
  })
});

exports.sendMail = functions.https.onRequest((request, response) => {
  cors(request, response, async() => {
    const order_id = request.query.order_id;
    const type = request.query.type;
    const orderSnap = await firestore.collection('Orders').doc(order_id).get();
    const orderInfo = orderSnap.data();

    const shippingDetails = orderInfo.shippingDetails;
    let subject=`Hi ${shippingDetails.name}`;
    let content='';
    let htmlContent='';
    let orderContent = '';
    orderInfo.orderItems.forEach(o => {
      orderContent += `${o.name_kana} (Size: ${o.size}, Color: ${o.color}, Price: $${o.price}) X ${o.quantity} \n`;
    })
    orderContent += `Tax: $${orderInfo.tax}\n`;
    orderContent += `Shipping Charges: $${orderInfo.shipping_charges}\n`;
    orderContent += `Order Total: $${orderInfo.total + orderInfo.shipping_charges}\n`;

    switch (type){
      case 'create_order':
        content = 'You purchased the following on VIP Billionaires.\n' + orderContent;
        htmlContent = '<div>You purchased the following on VIP Billionaires.</div>' + orderContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
        break;
      case 'complete_order':
        content = 'We completed your order.\n Please check the following.\n' + orderContent;
        htmlContent = '<div>We completed your order.</div> Please check the following.<br/></div>' + orderContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
        break;
      case 'cancel_order':
        content = 'We canceled your order.\n Please check the following.\n' + orderContent;
        htmlContent = '<div>We canceled your order.<br/>Please check the following.<br/></div>' + orderContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
        break;
      case 'shipping_order':
        content = 'Your order is shipping now. \n' + orderContent;
        htmlContent = '<div>Your order is shipping now. </div><br/>' + orderContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
        break;
    }

    let data = {
      from: Config.mailer_user,
      to: orderInfo.shippingDetails.email,
      subject: subject,
      text: content,
      html: htmlContent
    };

    transporter.sendMail(data, function (err, info) {
      if (err) {
        console.log('Send Mail Failed: ', err);
        return response.status(500).send(err.message);
      } else {
        console.log('Send Mail Success: ', info);
        return response.send(JSON.stringify(info));
      }
    });
  })
})

exports.cancelOrder = functions.https.onRequest((request, response) => {
  cors(request, response, async() => {
    const payment_intent_id = request.query.payment_intent_id;
    const amount = request.query.amount;
    if(!payment_intent_id || !amount){
      return response.status(500).send('invalid params');
    }
    try {
      const refundResult = await stripe.refunds.create({payment_intent: payment_intent_id, amount: amount});
      return response.send(JSON.stringify(refundResult));
    } catch (e) {
      return response.status(500).send(e.message);
    }
  })
})

const FIRST_ACTIVATE_TIME = 1000 * 3600 * 2;

// Schedule check approve user
exports.checkApprove = functions.pubsub.schedule('every 10 minutes').onRun(async (context) => {

  const userSnaps = await firestore.collection('User').get();

  const now = new Date();
  const checkedUsers = [];
  userSnaps.forEach(u => {
    const user = u.data();
    if(!user.approved && (now - new Date(user.createdAt.seconds * 1000)) > FIRST_ACTIVATE_TIME){
      checkedUsers.push({...user, id: u.id});
    }
  })

  for(let i = 0; i < checkedUsers.length; i++){
    const checkedUser = checkedUsers[i];

    const content = 'We have approved your application. Please check here vipbillionaires://';
    const htmlContent = '<h2>Thank you for applying to VIP Billionaires</h2><div>We have approved your application. Please check <a href="vipbillionaires://">here</a></div>';

    let data = {
      from: Config.mailer_user,
      to: checkedUser.email,
      subject: `Hi ${checkedUser.displayName}`,
      text: content,
      html: htmlContent
    };

    try{
      const info = await transporter.sendMail(data);
      await firestore.collection('User').doc(checkedUser.id).update({approved: true});
      console.log('Send Check Mail Success: ', info);
    } catch (e){
      console.log('Send Check Mail Failed: ', e);
    }
  }
})
