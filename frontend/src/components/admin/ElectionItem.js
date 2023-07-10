import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ElectionItem() {
    return (
        <Card>
            <Card.Body className='election-list-item-card row'>
                <div className='col-8'>
                    <Card.Title>Special title treatment</Card.Title>
                    <Card.Text style={{ color: "black" }}>
                        With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                </div>
                <div className='col'>       <Button variant="primary">Go somewhere</Button>
                </div>

            </Card.Body>
        </Card>
    );
}

export default ElectionItem;