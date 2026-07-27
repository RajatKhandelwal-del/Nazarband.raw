import React from "react";
import "./Contact.css";
import {Link} from 'react-router-dom'

export default function Contact() {
  return (
    <div className="contact-page">
      <nav style={{padding:"1rem 3rem 1rem 3rem"}}>
        <Link to={"/"} style={{width:"10%"}}><img src="/watermark.png" alt="" /></Link>
        <ul className="nav-links">
          <Link to={"/Services"}>Services</Link>
          <li><a href="#contact" className="active">Book session</a></li>
        </ul>
      </nav>

      <main style={{paddingTop:"1.5rem"}}>
        <div className="portrait-wrap">
          <div className="portrait-ring"></div>
          {/*
            Drop your own photo in by setting a real src below,
            or leave it empty to keep the monogram placeholder.
          */}
          <img
            className="portrait"
            src=""
            alt="Portrait"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
          <div className="portrait-fallback">Your Photo</div>
        </div>

        <div className="eyebrow">Let's Talk</div>

        <h1>
          Every frame starts
          <br />
          with a <em>conversation</em>
        </h1>

        <p className="sub">
          Have a story you'd like told in stillness? Reach out — whether it's
          a wedding, a portrait session, or a project that needs a second
          pair of eyes.
        </p>

        <div className="contact-list">
          <a className="contact-pill" href="mailto:hello@nazarband.com">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6l9 7 9-7" />
              <rect x="3" y="4" width="18" height="16" rx="1.5" />
            </svg>
            hello@nazarband.com
          </a>
          <a className="contact-pill" href="tel:+911234567890">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 3h4l1.5 5-2.5 1.5a12 12 0 0 0 6.5 6.5l1.5-2.5 5 1.5v4a2 2 0 0 1-2 2C10.6 21 3 13.4 3 5a2 2 0 0 1 2-2z" />
            </svg>
            +91 123 456 7890
          </a>
        </div>

        <div className="divider"></div>

        <div className="socials">
          <a href="#" target="_blank" rel="noreferrer">Instagram</a>
          <a href="#" target="_blank" rel="noreferrer">Behance</a>
          <a href="#" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </main>

      <footer>© 2026 नज़र बंद — All moments reserved</footer>
    </div>
  );
}
