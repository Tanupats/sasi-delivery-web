
import Barcode from 'react-barcode';
const QRCodeBill = ({ Id }) => {
    return (
        <div className="App">
            <center>
                <Barcode
                    value={Id.toString()}
                    format="CODE128"
                    width={2}
                    height={30}
                    displayValue={true}
                />
            </center>
        </div>
    );
}

export default QRCodeBill;