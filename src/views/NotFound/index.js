import React from "react";
import "./NotFound.css";
import { Helmet } from "react-helmet";

export default function NotFound() {
  return (
    <>
      <div className="Not-Found">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Page Not Found</title>
          <link rel="icon" type="image/x-icon" href="https://dac-datatech.vn/wp-content/uploads/2020/05/logo-300x200-1.png"></link>
          <meta name="description" content="Testing icon and titles" />
        </Helmet>
        <div className="logo-brand">
            <img
              src="https://dac-datatech.vn/wp-content/uploads/2020/05/logo-300x200-1.png"
              alt="logo"
            />
          <p>
            <a href="/">D.A.C Company</a>
          </p>
        </div>
        <div className="Notfound_content">
          <h2>404</h2>
          <h1>No content was found 😓</h1>
          <ul>
            <li className="NotFound_suggestion-msg">
              <strong>The URL of this content has been changed or does not exist</strong>
            </li>
            <li className="NotFound_suggestion-msg">
              <strong>If you are saving this URL, try accessing it again from the homepage instead of using the saved URL.</strong>
            </li>
          </ul>
          <p>
            <a className="Button_home" href="/">
              Go to dashboard
            </a>
          </p>
        </div>
      </div>
    </>
  );
}


