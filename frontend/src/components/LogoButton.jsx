import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const LostFoundButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/student-lost-found')}
            className="lost-found-btn"
        >
            <FontAwesomeIcon icon={faBox} /> Lost & Found
        </button>
    );
};

export default LostFoundButton;