import React from "react";

// Authentication related pages
import Login from "../views/pages/login";
import VerifyEmail from "../views/pages/verify";
import Page404 from "../views/pages/page404";
import Page500 from "../views/pages/page500";
import Dashboard from "../views/dashboard/Dashboard";
import ProductList from "../views/shop";
import OrderList from "../views/shop/orders";
import HeaderItemList from "../views/shop/headerItems";
import ReportList from "../views/reports";
import Settings from "../views/settings";
import UserList from "../views/users";
import PostList from "../views/posts";

export const authProtectedRoutes = [
  { path: "/users", name:'users', component: UserList },
  { path: "/posts", name:'posts', component: PostList },
  { path: "/header", name:'header_items', component: HeaderItemList },
  { path: "/orders", name:'orders', component: OrderList },
  { path: "/products", name:'products', component: ProductList },
  { path: "/reports", name:'reports', component: ReportList },
  { path: "/settings", name:'settings', component: Settings },
  { path: "/dashboard", name:'dashboard', component: Dashboard },
  { path: "/", name:'dashboard', exact: true, component: Dashboard },
];

export const publicRoutes = [
  { path: "/login", exact: true, component: Login },
  { path: "/verifyEmail", exact: true, isStatic: true, component: VerifyEmail },
  { path: "/404", exact: true, isStatic: true, component: Page404 },
  { path: "/500", exact: true, isStatic: true, component: Page500 },
];
