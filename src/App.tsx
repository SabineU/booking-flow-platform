import { useState } from 'react';
import { Step1Postcode } from './components/Step1Postcode';
import { Step2WasteType } from './components/Step2WasteType';
import { Step3SkipSelection } from './components/Step3SkipSelection';
import { Step4Review } from './components/Step4Review';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>({});

  const handleStep1Complete = (data: any) => {
    setBookingData((prev: any) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2Complete = (data: any) => {
    setBookingData((prev: any) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStep3Complete = (data: any) => {
    setBookingData((prev: any) => ({ ...prev, ...data }));
    setStep(4);
  };

  const handleConfirmComplete = () => {
    setStep(5);
  };

  const isHeavyWaste = bookingData.wasteType === 'heavy';

  return (
    <div className="app">
      {/* Main landmark for accessibility */}
      <main>
        {/* Level-one heading for accessibility */}
        <h1 className="visually-hidden">Skip Hire Booking</h1>
        {step === 1 && <Step1Postcode onNext={handleStep1Complete} />}
        {step === 2 && (
          <Step2WasteType
            onNext={handleStep2Complete}
            initialData={{
              wasteType: bookingData.wasteType,
              plasterboardOption: bookingData.plasterboardOption,
            }}
          />
        )}
        {step === 3 && (
          <Step3SkipSelection
            onNext={handleStep3Complete}
            initialData={{ skipSize: bookingData.skipSize, price: bookingData.price }}
            isHeavyWaste={isHeavyWaste}
            postcode={bookingData.postcode}
          />
        )}
        {step === 4 && (
          <Step4Review
            data={{
              postcode: bookingData.postcode,
              address: bookingData.address,
              manualAddress: bookingData.manualAddress,
              wasteType: bookingData.wasteType,
              plasterboardOption: bookingData.plasterboardOption,
              skipSize: bookingData.skipSize,
              price: bookingData.price,
            }}
            onConfirm={handleConfirmComplete}
          />
        )}
        {step === 5 && (
          <div className="success-page">
            <h2>Thank you for your booking!</h2>
            <p>We will be in touch shortly.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
