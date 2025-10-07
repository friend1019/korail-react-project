// src/components/manual/ManualHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "styles/manual/ManualHeader.css";

export default function ManualHeader({ title = "메뉴얼", right = null, left = null, showBack = true }) {
  const navigate = useNavigate();

  return (
    <header className="manual-header" role="banner">
      <div className="manual-header__side">
        {showBack && (
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
          >
            {/* ← 아이콘 (inline SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        {left}
      </div>

      <h1 className="manual-header__title">{title}</h1>

      <div className="manual-header__side manual-header__side--right">{right}</div>
    </header>
  );
}
