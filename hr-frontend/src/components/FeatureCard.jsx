function FeatureCard({ icon, title, description, onClick }) {
    return (
        <button className="feature-card" onClick={onClick}>
            <div className="feature-icon">{icon}</div>

            <div className="feature-card-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>

            <span className="feature-arrow">→</span>
        </button>
    );
}

export default FeatureCard;