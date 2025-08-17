import React from 'react'
import './FooterBar.scss'

function FooterBar({ onToggleCamera, onReset, showedKeyPoints, onChangeShowKeyPoints }) {
    return (
        <div className="footer-bar">
            <div className="footer-blur" />

            <div className="footer-actions">
                <button className="fb-btn" onClick={onToggleCamera} aria-label="Cambiar cámara">
                    {/* ícono switch cámara */}
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 7h2.586l1.707-1.707A1 1 0 0 1 12 5h4a1 1 0 0 1 .894.553L18.618 7H19a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-1.382l-.724 1.447A1 1 0 0 1 16 19h-4a1 1 0 0 1-.707-.293L9.586 17H7a4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v2c0 1.103.897 2 2 2h3a1 1 0 0 1 .707.293L12.414 17H15.7l.724-1.447A1 1 0 0 1 17.618 15H19a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1.382a1 1 0 0 1-.894-.553L15.382 7H12.1l-1.293 1.293A1 1 0 0 1 10.1 9H7Z" fill="currentColor" />
                    </svg>
                    <span>Cámara</span>
                </button>

                <button className="fb-btn" onClick={onReset} aria-label="Resetear contador">
                    {/* ícono reset */}
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 6V3l-4 4 4 4V8c2.206 0 4 1.794 4 4a4 4 0 1 1-4-4Zm0-2a6 6 0 1 0 6 6h-2a4 4 0 1 1-4-4Z" fill="currentColor" />
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
