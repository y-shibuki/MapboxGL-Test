import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ Title, isOpen, setShow, children }) => {
    const closeModal = () => setShow(false);

    return (
        <div className='overlay' onClick={closeModal} style={{visibility: isOpen ? 'visible' : 'hidden'}}>
            <div onClick={(e) => e.stopPropagation()}>
                <span>{Title}</span>
                <FontAwesomeIcon icon={faXmark} size="2x" onClick={closeModal} />
                {children}
            </div>
        </div>
    )
}

export default Modal;