import React from 'react'
import './FooterBar.scss'

function FooterBar({ onToggleCamera, onReset, showedKeyPoints, onChangeShowKeyPoints }) {
    return (
        <div className="footer-bar">
            <div className="footer-blur" />

            <div className="footer-actions">
                <button className="fb-btn" onClick={onToggleCamera} aria-label="Cambiar cámara">
                    {/* ícono switch cámara */}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                    <path d="M480-240q79 0 136-53.5T678-426l30 28 42-42-100-100-100 100 42 42 26-26q-6 53-45 88.5T480-300q-13 0-25.5-2.5T430-310l-44 44q22 12 45.5 19t48.5 7ZM310-340l100-100-42-42-26 26q6-53 45-88.5t93-35.5q13 0 25.5 2.5T530-570l44-44q-22-12-45.5-19t-48.5-7q-79 0-136 53.5T282-454l-30-28-42 42 100 100ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" />
                    </svg>
                    <span>Cámara</span>
                </button>

                <button className="fb-btn" onClick={onReset} aria-label="Resetear contador">
                    {/* ícono reset */}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                    <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                    </svg>
                    <span>Reset</span>
                </button>

                <button className="fb-btn" onClick={onChangeShowKeyPoints} aria-pressed={showedKeyPoints}>
                    {showedKeyPoints ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                            <line x1="3" y1="3" x2="21" y2="21" />
                        </svg>
                    )}
                    <span>{showedKeyPoints ? 'Ocultar' : 'Mostrar'}</span>
                </button>
            </div>
        </div>
    )
}

export default FooterBar
