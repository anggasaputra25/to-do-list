import { Pen, Plus, TrashFill } from 'react-bootstrap-icons';
import { useEffect, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Alert, Container, Dropdown } from 'react-bootstrap';

const Home = () => {
    const [show, setShow] = useState(false);
    const [warning, setWarning] = useState();
    const [title, setTitle] = useState();
    const [read, setRead] = useState(true);
    const [message, setMessage] = useState([]);
    const bgClasses = ['bg-purple', 'bg-orange', 'bg-success', 'bg-pink'];

    // Local Storage
    const [titles, setTitles] = useState(JSON.parse(localStorage.getItem('titles')) || []);
    const [descriptions, setDescriptions] = useState(JSON.parse(localStorage.getItem('descriptions')) || []);
    const [backgrounds, setBackgrounds] = useState(JSON.parse(localStorage.getItem('backgrounds')) || []);

    const timerRef = useRef(null);

    const removeMsg = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setMessage([]);
        }, 2000);
    }

    const handleSave = () => {
        if (title.trim() === '') {
            setWarning('Title cannot be empty');
            return;
        }
        setTitles((prevTitle) => [...prevTitle, title]);
        setDescriptions((prevDescription) => [...prevDescription, 'empty']);
        setBackgrounds((prevBg) => [...prevBg, 'bg-purple']);
        setShow(false);
        setMessage(['Successfully created a note!', 'primary']);
        removeMsg();
    }

    const removeNote = (index) => {
        if (window.confirm('Are you sure you want to delete ' + titles[index] + ' note?')) {
            const updateTitle = titles.filter((item, i) => i !== index);
            const updateDesc = descriptions.filter((item, i) => i !== index);
            const updateBg = backgrounds.filter((item, i) => i !== index);
    
            setTitles(updateTitle);
            setDescriptions(updateDesc);
            setBackgrounds(updateBg);
            setMessage(['Successfully deleted a note!', 'danger']);
            removeMsg();
        }
    }

    const handleRead = () => {
        setRead(!read);
    }

    const handleBg = (i, bg_index) => {
        const newBg = [...backgrounds]; // Menyalin array Backgrounds
        newBg[i] = bgClasses[bg_index]; // Memperbarui elemen yang sesuai
        setBackgrounds(newBg); // Mengatur kembali state descriptions
    }

    useEffect(() => {
        localStorage.setItem('titles', JSON.stringify(titles));
        localStorage.setItem('descriptions', JSON.stringify(descriptions));
        localStorage.setItem('backgrounds', JSON.stringify(backgrounds));
    }, [titles, descriptions, backgrounds]);

    useEffect(() => {
        setTitle('');
        setWarning('');
    }, [show]);

    return (
        <>
            <Button variant={read ? 'outline-warning' : 'warning'} className={`p-3 rounded-circle position-fixed bottom-0 end-0 ${titles.length === 0 ? '' : 'me-3'}`} onClick={handleRead} style={{ marginBottom: '80px', marginRight: '-100px', transition: 'all ease 0.5s', transform: titles.length === 0 ? 'rotate(50deg)' : 'rotate(0deg)' }}><Pen className='fs-4' /></Button>
            <Button variant="outline-primary" onClick={() => setShow(true)} className='p-2 rounded-circle position-fixed bottom-0 end-0 m-3'><Plus className='fs-1' /></Button>

            {message.length !== 0 && (
                <Alert variant={message[1]} className='position-fixed end-0 me-2 z-2'>{message[0]}</Alert>
            )}

            <Container fluid className='p-0 m-0 mt-2 px-2 row'>
                {titles.map((title, i) => {
                    return (
                        <div className="p-1 col-lg-3 col-md-6 col-12" key={i}>
                            <div className={`myCard shadow-sm p-2 rounded-1 ${backgrounds[i]}`} style={{ height: '300px' }}>
                                <div className="head border-bottom border-2 mb-1 pb-2 d-flex gap-2">
                                    <h3 className='m-0 w-100'>{title.length > 20 ? `${title.slice(0, 20)}...` : title}</h3>
                                    <Button variant='danger p-0 px-2' onClick={() => removeNote(i)}><TrashFill /></Button>
                                    <Dropdown className='p-1 rounded-circle bg-dark'>
                                        <Dropdown.Toggle className={`${backgrounds[i]} rounded-circle p-1 btn-outline-dark`} style={{ height: '30px', width: '30px', cursor: 'pointer' }}>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {bgClasses.map((background, bg_index) => {
                                                return (
                                                    <Dropdown.Item key={bg_index} onClick={() => handleBg(i, bg_index)}>
                                                        <div className={`rounded ${background}`} style={{ height: '40px' }}></div>
                                                    </Dropdown.Item>
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="desc">
                                    <textarea readOnly={read} className='w-100 bg-transparent text-white border-0' style={{ resize: 'none', height: '230px' }} value={descriptions[i]} onChange={(evt) => {
                                        const newDescriptions = [...descriptions]; // Menyalin array descriptions
                                        newDescriptions[i] = evt.target.value; // Memperbarui elemen yang sesuai
                                        setDescriptions(newDescriptions); // Mengatur kembali state descriptions
                                    }} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Container>

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header>
                    <Modal.Title>Create title for your new Note!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="My Journey"
                        onChange={(evt) => setTitle(evt.target.value)}
                        autoFocus
                    />
                    <p className='m-0 text-danger ms-1'>{warning}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Home;
