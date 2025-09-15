import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertySaleCertificateForm from '../PropertySaleCertificateForm';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe('PropertySaleCertificateForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
    fetch.mockClear();
    mockPush.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();
  });

  test('renders the form with all sections', () => {
    render(<PropertySaleCertificateForm />);
    
    // Check if all sections are rendered
    expect(screen.getByText('संपत्ति बिक्री प्रमाण पत्र जनरेटर')).toBeInTheDocument();
    expect(screen.getByText('सुरक्षित लेनदार / बैंक')).toBeInTheDocument();
    expect(screen.getByText('रसीद की राशि')).toBeInTheDocument();
    expect(screen.getByText('संपत्ति विवरण')).toBeInTheDocument();
    expect(screen.getByText('सीमा विवरण')).toBeInTheDocument();
    expect(screen.getByText('सर्किल रेट और स्टाम्प ड्यूटी विवरण (Government Rate)')).toBeInTheDocument();
    expect(screen.getByText('कानूनी विवरण')).toBeInTheDocument();
    expect(screen.getByText('खरीददार')).toBeInTheDocument();
    expect(screen.getByText('भुगतान विवरण')).toBeInTheDocument();
    expect(screen.getByText('एग्रीमेंट और भुगतान योजना')).toBeInTheDocument();
    expect(screen.getByText('गवाह')).toBeInTheDocument();
    expect(screen.getByText('अन्य विवरण')).toBeInTheDocument();
  });

  test('renders all required form fields', () => {
    render(<PropertySaleCertificateForm />);
    
    // Bank fields
    expect(screen.getByLabelText('बैंक का नाम *')).toBeInTheDocument();
    expect(screen.getByLabelText('पंजीकृत कार्यालय का पता *')).toBeInTheDocument();
    expect(screen.getByLabelText('प्रधान कार्यालय *')).toBeInTheDocument();
    expect(screen.getByLabelText('बैंक प्रतिनिधि का नाम *')).toBeInTheDocument();
    expect(screen.getByLabelText('पिता/पति का नाम *')).toBeInTheDocument();
    expect(screen.getByLabelText('पता *')).toBeInTheDocument();
    expect(screen.getByLabelText('मोबाइल नंबर *')).toBeInTheDocument();

    // Acknowledgement fields
    expect(screen.getByLabelText('रसीद की राशि (₹) *')).toBeInTheDocument();

    // Previous Owner fields
    expect(screen.getByLabelText('पूर्व-स्वामी का नाम *')).toBeInTheDocument();
    expect(screen.getByLabelText('मोड ऑफ एक्विजिशन *')).toBeInTheDocument();
    expect(screen.getByLabelText('बैंक को संपत्ति पर अधिकार कैसे मिला *')).toBeInTheDocument();

    // Property fields
    expect(screen.getByLabelText('संपत्ति श्रेणी *')).toBeInTheDocument();
    expect(screen.getByLabelText('उपयोग *')).toBeInTheDocument();
    expect(screen.getByLabelText('संपत्ति का पूरा पता *')).toBeInTheDocument();
    expect(screen.getByLabelText('राज्य *')).toBeInTheDocument();
    expect(screen.getByLabelText('तहसील *')).toBeInTheDocument();
    expect(screen.getByLabelText('वार्ड/गांव/कॉलोनी *')).toBeInTheDocument();

    // Boundary fields
    expect(screen.getByLabelText('उत्तर दिशा की सीमा *')).toBeInTheDocument();
    expect(screen.getByLabelText('दक्षिण दिशा की सीमा *')).toBeInTheDocument();
    expect(screen.getByLabelText('पूर्व दिशा की सीमा *')).toBeInTheDocument();
    expect(screen.getByLabelText('पश्चिम दिशा की सीमा *')).toBeInTheDocument();

    // Circle Rate and Stamp Duty fields
    expect(screen.getByLabelText('सर्किल रेट (प्रति वर्ग मीटर में) *')).toBeInTheDocument();
    expect(screen.getByLabelText('स्टाम्प ड्यूटी *')).toBeInTheDocument();
    expect(screen.getByLabelText('ई-स्टाम्प नं. *')).toBeInTheDocument();
    expect(screen.getByLabelText('स्टाम्प राशि (₹) *')).toBeInTheDocument();
    expect(screen.getByLabelText('स्टाम्प की तारीख *')).toBeInTheDocument();

    // Legal fields
    expect(screen.getByLabelText('लागू नियम और विनियम चुनें *')).toBeInTheDocument();
    expect(screen.getByLabelText('कानूनी क्लॉज *')).toBeInTheDocument();

    // Agreement fields
    expect(screen.getByLabelText('एग्रीमेंट संख्या *')).toBeInTheDocument();
    expect(screen.getByLabelText('एग्रीमेंट की तारीख *')).toBeInTheDocument();
    expect(screen.getByLabelText('भुगतान योजना/शर्तें *')).toBeInTheDocument();

    // Other fields
    expect(screen.getByLabelText('एडवोकेट का नाम *')).toBeInTheDocument();
    expect(screen.getByLabelText('ड्राफ्ट प्रिंट होने की तिथि *')).toBeInTheDocument();
  });

  test('displays validation errors for required fields', async () => {
    render(<PropertySaleCertificateForm />);
    
    // Try to submit without filling any fields
    fireEvent.click(screen.getByRole('button', { name: 'संपत्ति बिक्री प्रमाण पत्र जमा करें' }));

    await waitFor(() => {
      expect(screen.getByText('बैंक का नाम आवश्यक है')).toBeInTheDocument();
      expect(screen.getByText('बैंक प्रतिनिधि का नाम आवश्यक है')).toBeInTheDocument();
      expect(screen.getByText('रसीद की राशि आवश्यक है')).toBeInTheDocument();
    });
  });

  test('displays validation errors for invalid mobile format', async () => {
    render(<PropertySaleCertificateForm />);
    
    const mobileField = screen.getByLabelText('मोबाइल नंबर *');
    fireEvent.change(mobileField, { target: { value: '123456789' } });
    fireEvent.blur(mobileField);

    await waitFor(() => {
      expect(screen.getByText('मोबाइल नंबर 10 अंकों का होना चाहिए')).toBeInTheDocument();
    });
  });

  test('displays validation errors for invalid email format', async () => {
    render(<PropertySaleCertificateForm />);
    
    const emailField = screen.getByLabelText('ईमेल');
    fireEvent.change(emailField, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailField);

    await waitFor(() => {
      expect(screen.getByText('वैध ईमेल आवश्यक है')).toBeInTheDocument();
    });
  });

  test('displays validation errors for negative circle rate', async () => {
    render(<PropertySaleCertificateForm />);
    
    const circleRateField = screen.getByLabelText('सर्किल रेट (प्रति वर्ग मीटर में) *');
    fireEvent.change(circleRateField, { target: { value: '-1000' } });
    fireEvent.blur(circleRateField);

    await waitFor(() => {
      expect(screen.getByText('सर्किल रेट धनात्मक होना चाहिए')).toBeInTheDocument();
    });
  });

  test('displays validation errors for negative stamp duty', async () => {
    render(<PropertySaleCertificateForm />);
    
    const stampDutyField = screen.getByLabelText('स्टाम्प ड्यूटी *');
    fireEvent.change(stampDutyField, { target: { value: '-500' } });
    fireEvent.blur(stampDutyField);

    await waitFor(() => {
      expect(screen.getByText('स्टाम्प ड्यूटी धनात्मक होनी चाहिए')).toBeInTheDocument();
    });
  });

  test('displays validation errors for invalid property category', async () => {
    render(<PropertySaleCertificateForm />);
    
    const categoryField = screen.getByLabelText('संपत्ति श्रेणी *');
    fireEvent.change(categoryField, { target: { value: 'अमान्य' } });
    fireEvent.blur(categoryField);

    await waitFor(() => {
      expect(screen.getByText('अमान्य संपत्ति श्रेणी')).toBeInTheDocument();
    });
  });

  test('displays validation errors for empty power authority array', async () => {
    render(<PropertySaleCertificateForm />);
    
    // Try to submit without selecting any power authority
    fireEvent.click(screen.getByRole('button', { name: 'संपत्ति बिक्री प्रमाण पत्र जमा करें' }));

    await waitFor(() => {
      expect(screen.getByText('कम से कम एक अधिकार और शक्ति चुनें')).toBeInTheDocument();
    });
  });

  test('allows adding and removing purchasers', async () => {
    render(<PropertySaleCertificateForm />);
    
    // Click add purchaser button
    fireEvent.click(screen.getByText('+ खरीददार जोड़ें'));
    
    // Check if purchaser form is added
    expect(screen.getByText('खरीददार 1')).toBeInTheDocument();
    
    // Check if remove button is present
    const removeButton = screen.getByText('हटाएँ');
    expect(removeButton).toBeInTheDocument();
    
    // Click remove button
    fireEvent.click(removeButton);
    
    // Check if purchaser form is removed
    await waitFor(() => {
      expect(screen.queryByText('खरीददार 1')).not.toBeInTheDocument();
    });
  });

  test('allows adding and removing witnesses', async () => {
    render(<PropertySaleCertificateForm />);
    
    // Click add witness button
    fireEvent.click(screen.getByText('+ गवाह जोड़ें'));
    
    // Check if witness form is added
    expect(screen.getByText('गवाह 1')).toBeInTheDocument();
    
    // Check if remove button is present
    const removeButton = screen.getByText('हटाएँ');
    expect(removeButton).toBeInTheDocument();
    
    // Click remove button
    fireEvent.click(removeButton);
    
    // Check if witness form is removed
    await waitFor(() => {
      expect(screen.queryByText('गवाह 1')).not.toBeInTheDocument();
    });
  });

  test('allows adding and removing payments', async () => {
    render(<PropertySaleCertificateForm />);
    
    // Click add payment button
    fireEvent.click(screen.getByText('+ भुगतान जोड़ें'));
    
    // Check if payment form is added
    expect(screen.getByText('भुगतान 1')).toBeInTheDocument();
    
    // Check if remove button is present
    const removeButton = screen.getByText('हटाएँ');
    expect(removeButton).toBeInTheDocument();
    
    // Click remove button
    fireEvent.click(removeButton);
    
    // Check if payment form is removed
    await waitFor(() => {
      expect(screen.queryByText('भुगतान 1')).not.toBeInTheDocument();
    });
  });

  test('auto-populates property data when category is selected', async () => {
    render(<PropertySaleCertificateForm />);
    
    // Select Residential category
    const categoryField = screen.getByLabelText('संपत्ति श्रेणी *');
    fireEvent.change(categoryField, { target: { value: 'Residential' } });
    
    // Check if subtype options are populated
    const subtypeField = screen.getByLabelText('उपयोग *');
    expect(subtypeField).toBeInTheDocument();
    
    // Select a subtype
    fireEvent.change(subtypeField, { target: { value: 'Flat' } });
    
    // Check if address is auto-populated
    const addressField = screen.getByLabelText('संपत्ति का पूरा पता *');
    expect(addressField.value).toBe('प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली');
  });

  test('auto-populates legal clauses when rule is selected', async () => {
    render(<PropertySaleCertificateForm />);
    
    // Select a legal rule
    const ruleField = screen.getByLabelText('लागू नियम और विनियम चुनें *');
    fireEvent.change(ruleField, { target: { value: 'SARFAESI_Act' } });
    
    // Check if legal clauses are auto-populated
    const clausesField = screen.getByLabelText('कानूनी क्लॉज *');
    expect(clausesField.value).toContain('SARFAESI Act, 2002');
  });

  test('calculates stamp duty automatically', async () => {
    render(<PropertySaleCertificateForm />);
    
    // Fill circle rate
    const circleRateField = screen.getByLabelText('सर्किल रेट (प्रति वर्ग मीटर में) *');
    fireEvent.change(circleRateField, { target: { value: '10000' } });
    
    // Select property category and subtype
    const categoryField = screen.getByLabelText('संपत्ति श्रेणी *');
    fireEvent.change(categoryField, { target: { value: 'Residential' } });
    
    const subtypeField = screen.getByLabelText('उपयोग *');
    fireEvent.change(subtypeField, { target: { value: 'Flat' } });
    
    // Fill super area
    const superAreaField = screen.getByLabelText('सुपर एरिया (वर्ग मीटर में) *');
    fireEvent.change(superAreaField, { target: { value: '150' } });
    
    // Check if calculations are performed
    await waitFor(() => {
      const circleRateValueField = screen.getByLabelText('संपत्ति का मूल्यांकन');
      expect(circleRateValueField.value).toBe('1800000.00');
    });
  });

  test('submits the form successfully with valid data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success', message: 'Property Sale Certificate saved successfully', id: '123' }),
    });

    render(<PropertySaleCertificateForm />);
    
    // Fill in all required fields
    fireEvent.change(screen.getByLabelText('बैंक का नाम *'), { target: { value: 'SBI' } });
    fireEvent.change(screen.getByLabelText('पंजीकृत कार्यालय का पता *'), { target: { value: '123 Main Street, Mumbai' } });
    fireEvent.change(screen.getByLabelText('प्रधान कार्यालय *'), { target: { value: '456 Corporate Avenue, Mumbai' } });
    fireEvent.change(screen.getByLabelText('बैंक प्रतिनिधि का नाम *'), { target: { value: 'राम शर्मा' } });
    fireEvent.change(screen.getByLabelText('पिता/पति का नाम *'), { target: { value: 'शिव शर्मा' } });
    fireEvent.change(screen.getByLabelText('पता *'), { target: { value: '789 Bank Colony, Mumbai' } });
    fireEvent.change(screen.getByLabelText('मोबाइल नंबर *'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText('रसीद की राशि (₹) *'), { target: { value: '5000000' } });
    fireEvent.change(screen.getByLabelText('पूर्व-स्वामी का नाम *'), { target: { value: 'कृष्ण कुमार' } });
    fireEvent.change(screen.getByLabelText('मोड ऑफ एक्विजिशन *'), { target: { value: 'बैंक द्वारा अधिग्रहण' } });
    fireEvent.change(screen.getByLabelText('बैंक को संपत्ति पर अधिकार कैसे मिला *'), { target: { value: 'एसएआरएफएईएसआई अधिनियम के तहत' } });
    fireEvent.change(screen.getByLabelText('संपत्ति श्रेणी *'), { target: { value: 'Residential' } });
    fireEvent.change(screen.getByLabelText('उपयोग *'), { target: { value: 'Flat' } });
    fireEvent.change(screen.getByLabelText('संपत्ति का पूरा पता *'), { target: { value: 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली' } });
    fireEvent.change(screen.getByLabelText('राज्य *'), { target: { value: 'Uttar Pradesh' } });
    fireEvent.change(screen.getByLabelText('तहसील *'), { target: { value: 'Ghaziabad' } });
    fireEvent.change(screen.getByLabelText('वार्ड/गांव/कॉलोनी *'), { target: { value: 'Noida' } });
    fireEvent.change(screen.getByLabelText('उत्तर दिशा की सीमा *'), { target: { value: 'राम शर्मा का घर' } });
    fireEvent.change(screen.getByLabelText('दक्षिण दिशा की सीमा *'), { target: { value: 'मुख्य सड़क' } });
    fireEvent.change(screen.getByLabelText('पूर्व दिशा की सीमा *'), { target: { value: 'पार्क' } });
    fireEvent.change(screen.getByLabelText('पश्चिम दिशा की सीमा *'), { target: { value: 'शर्मा जी का घर' } });
    fireEvent.change(screen.getByLabelText('सर्किल रेट (प्रति वर्ग मीटर में) *'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('स्टाम्प ड्यूटी *'), { target: { value: '90000' } });
    fireEvent.change(screen.getByLabelText('ई-स्टाम्प नं. *'), { target: { value: 'EST123456789' } });
    fireEvent.change(screen.getByLabelText('स्टाम्प राशि (₹) *'), { target: { value: '90000' } });
    fireEvent.change(screen.getByLabelText('स्टाम्प की तारीख *'), { target: { value: '2024-01-15' } });
    fireEvent.change(screen.getByLabelText('लागू नियम और विनियम चुनें *'), { target: { value: 'SARFAESI_Act' } });
    fireEvent.change(screen.getByLabelText('एग्रीमेंट संख्या *'), { target: { value: 'AGR2024001' } });
    fireEvent.change(screen.getByLabelText('एग्रीमेंट की तारीख *'), { target: { value: '2024-01-15' } });
    fireEvent.change(screen.getByLabelText('भुगतान योजना/शर्तें *'), { target: { value: 'कुल कीमत 3 किस्तों में भुगतान की गई' } });
    fireEvent.change(screen.getByLabelText('एडवोकेट का नाम *'), { target: { value: 'अडवोकेट राजेश कुमार' } });
    fireEvent.change(screen.getByLabelText('ड्राफ्ट प्रिंट होने की तिथि *'), { target: { value: '2024-01-15' } });

    // Select power authority checkboxes
    const fullOwnershipCheckbox = screen.getByLabelText('संपत्ति का पूर्ण स्वामित्व अधिकार');
    fireEvent.click(fullOwnershipCheckbox);

    fireEvent.click(screen.getByRole('button', { name: 'संपत्ति बिक्री प्रमाण पत्र जमा करें' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/property-sale-certificate', {
        method: 'POST',
        body: expect.any(FormData),
      });
      expect(toast.success).toHaveBeenCalledWith('संपत्ति बिक्री प्रमाण पत्र सफलतापूर्वक जमा हो गया!');
    });
  });

  test('displays error message on failed submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ status: 'failed', message: 'Server error' }),
    });

    render(<PropertySaleCertificateForm />);
    
    // Fill in minimal required fields
    fireEvent.change(screen.getByLabelText('बैंक का नाम *'), { target: { value: 'SBI' } });
    fireEvent.change(screen.getByLabelText('पंजीकृत कार्यालय का पता *'), { target: { value: '123 Main Street, Mumbai' } });
    fireEvent.change(screen.getByLabelText('प्रधान कार्यालय *'), { target: { value: '456 Corporate Avenue, Mumbai' } });
    fireEvent.change(screen.getByLabelText('बैंक प्रतिनिधि का नाम *'), { target: { value: 'राम शर्मा' } });
    fireEvent.change(screen.getByLabelText('पिता/पति का नाम *'), { target: { value: 'शिव शर्मा' } });
    fireEvent.change(screen.getByLabelText('पता *'), { target: { value: '789 Bank Colony, Mumbai' } });
    fireEvent.change(screen.getByLabelText('मोबाइल नंबर *'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText('रसीद की राशि (₹) *'), { target: { value: '5000000' } });
    fireEvent.change(screen.getByLabelText('पूर्व-स्वामी का नाम *'), { target: { value: 'कृष्ण कुमार' } });
    fireEvent.change(screen.getByLabelText('मोड ऑफ एक्विजिशन *'), { target: { value: 'बैंक द्वारा अधिग्रहण' } });
    fireEvent.change(screen.getByLabelText('बैंक को संपत्ति पर अधिकार कैसे मिला *'), { target: { value: 'एसएआरएफएईएसआई अधिनियम के तहत' } });
    fireEvent.change(screen.getByLabelText('संपत्ति श्रेणी *'), { target: { value: 'Residential' } });
    fireEvent.change(screen.getByLabelText('उपयोग *'), { target: { value: 'Flat' } });
    fireEvent.change(screen.getByLabelText('संपत्ति का पूरा पता *'), { target: { value: 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली' } });
    fireEvent.change(screen.getByLabelText('राज्य *'), { target: { value: 'Uttar Pradesh' } });
    fireEvent.change(screen.getByLabelText('तहसील *'), { target: { value: 'Ghaziabad' } });
    fireEvent.change(screen.getByLabelText('वार्ड/गांव/कॉलोनी *'), { target: { value: 'Noida' } });
    fireEvent.change(screen.getByLabelText('उत्तर दिशा की सीमा *'), { target: { value: 'राम शर्मा का घर' } });
    fireEvent.change(screen.getByLabelText('दक्षिण दिशा की सीमा *'), { target: { value: 'मुख्य सड़क' } });
    fireEvent.change(screen.getByLabelText('पूर्व दिशा की सीमा *'), { target: { value: 'पार्क' } });
    fireEvent.change(screen.getByLabelText('पश्चिम दिशा की सीमा *'), { target: { value: 'शर्मा जी का घर' } });
    fireEvent.change(screen.getByLabelText('सर्किल रेट (प्रति वर्ग मीटर में) *'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('स्टाम्प ड्यूटी *'), { target: { value: '90000' } });
    fireEvent.change(screen.getByLabelText('ई-स्टाम्प नं. *'), { target: { value: 'EST123456789' } });
    fireEvent.change(screen.getByLabelText('स्टाम्प राशि (₹) *'), { target: { value: '90000' } });
    fireEvent.change(screen.getByLabelText('स्टाम्प की तारीख *'), { target: { value: '2024-01-15' } });
    fireEvent.change(screen.getByLabelText('लागू नियम और विनियम चुनें *'), { target: { value: 'SARFAESI_Act' } });
    fireEvent.change(screen.getByLabelText('एग्रीमेंट संख्या *'), { target: { value: 'AGR2024001' } });
    fireEvent.change(screen.getByLabelText('एग्रीमेंट की तारीख *'), { target: { value: '2024-01-15' } });
    fireEvent.change(screen.getByLabelText('भुगतान योजना/शर्तें *'), { target: { value: 'कुल कीमत 3 किस्तों में भुगतान की गई' } });
    fireEvent.change(screen.getByLabelText('एडवोकेट का नाम *'), { target: { value: 'अडवोकेट राजेश कुमार' } });
    fireEvent.change(screen.getByLabelText('ड्राफ्ट प्रिंट होने की तिथि *'), { target: { value: '2024-01-15' } });

    // Select power authority checkboxes
    const fullOwnershipCheckbox = screen.getByLabelText('संपत्ति का पूर्ण स्वामित्व अधिकार');
    fireEvent.click(fullOwnershipCheckbox);

    fireEvent.click(screen.getByRole('button', { name: 'संपत्ति बिक्री प्रमाण पत्र जमा करें' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith('Server error');
    });
  });

  test('handles file upload correctly', async () => {
    render(<PropertySaleCertificateForm />);
    
    const fileInput = screen.getByLabelText('पासपोर्ट-साइज़ फ़ोटो अपलोड करें');
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(fileInput.files[0]).toBe(file);
  });

  test('displays loading state during submission', async () => {
    fetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<PropertySaleCertificateForm />);
    
    // Fill in minimal required fields
    fireEvent.change(screen.getByLabelText('बैंक का नाम *'), { target: { value: 'SBI' } });
    fireEvent.change(screen.getByLabelText('पंजीकृत कार्यालय का पता *'), { target: { value: '123 Main Street, Mumbai' } });
    fireEvent.change(screen.getByLabelText('प्रधान कार्यालय *'), { target: { value: '456 Corporate Avenue, Mumbai' } });
    fireEvent.change(screen.getByLabelText('बैंक प्रतिनिधि का नाम *'), { target: { value: 'राम शर्मा' } });
    fireEvent.change(screen.getByLabelText('पिता/पति का नाम *'), { target: { value: 'शिव शर्मा' } });
    fireEvent.change(screen.getByLabelText('पता *'), { target: { value: '789 Bank Colony, Mumbai' } });
    fireEvent.change(screen.getByLabelText('मोबाइल नंबर *'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText('रसीद की राशि (₹) *'), { target: { value: '5000000' } });
    fireEvent.change(screen.getByLabelText('पूर्व-स्वामी का नाम *'), { target: { value: 'कृष्ण कुमार' } });
    fireEvent.change(screen.getByLabelText('मोड ऑफ एक्विजिशन *'), { target: { value: 'बैंक द्वारा अधिग्रहण' } });
    fireEvent.change(screen.getByLabelText('बैंक को संपत्ति पर अधिकार कैसे मिला *'), { target: { value: 'एसएआरएफएईएसआई अधिनियम के तहत' } });
    fireEvent.change(screen.getByLabelText('संपत्ति श्रेणी *'), { target: { value: 'Residential' } });
    fireEvent.change(screen.getByLabelText('उपयोग *'), { target: { value: 'Flat' } });
    fireEvent.change(screen.getByLabelText('संपत्ति का पूरा पता *'), { target: { value: 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली' } });
    fireEvent.change(screen.getByLabelText('राज्य *'), { target: { value: 'Uttar Pradesh' } });
    fireEvent.change(screen.getByLabelText('तहसील *'), { target: { value: 'Ghaziabad' } });
    fireEvent.change(screen.getByLabelText('वार्ड/गांव/कॉलोनी *'), { target: { value: 'Noida' } });
    fireEvent.change(screen.getByLabelText('उत्तर दिशा की सीमा *'), { target: { value: 'राम शर्मा का घर' } });
    fireEvent.change(screen.getByLabelText('दक्षिण दिशा की सीमा *'), { target: { value: 'मुख्य सड़क' } });
    fireEvent.change(screen.getByLabelText('पूर्व दिशा की सीमा *'), { target: { value: 'पार्क' } });
    fireEvent.change(screen.getByLabelText('पश्चिम दिशा की सीमा *'), { target: { value: 'शर्मा जी का घर' } });
    fireEvent.change(screen.getByLabelText('सर्किल रेट (प्रति वर्ग मीटर में) *'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('स्टाम्प ड्यूटी *'), { target: { value: '90000' } });
    fireEvent.change(screen.getByLabelText('ई-स्टाम्प नं. *'), { target: { value: 'EST123456789' } });
    fireEvent.change(screen.getByLabelText('स्टाम्प राशि (₹) *'), { target: { value: '90000' } });
    fireEvent.change(screen.getByLabelText('स्टाम्प की तारीख *'), { target: { value: '2024-01-15' } });
    fireEvent.change(screen.getByLabelText('लागू नियम और विनियम चुनें *'), { target: { value: 'SARFAESI_Act' } });
    fireEvent.change(screen.getByLabelText('एग्रीमेंट संख्या *'), { target: { value: 'AGR2024001' } });
    fireEvent.change(screen.getByLabelText('एग्रीमेंट की तारीख *'), { target: { value: '2024-01-15' } });
    fireEvent.change(screen.getByLabelText('भुगतान योजना/शर्तें *'), { target: { value: 'कुल कीमत 3 किस्तों में भुगतान की गई' } });
    fireEvent.change(screen.getByLabelText('एडवोकेट का नाम *'), { target: { value: 'अडवोकेट राजेश कुमार' } });
    fireEvent.change(screen.getByLabelText('ड्राफ्ट प्रिंट होने की तिथि *'), { target: { value: '2024-01-15' } });

    // Select power authority checkboxes
    const fullOwnershipCheckbox = screen.getByLabelText('संपत्ति का पूर्ण स्वामित्व अधिकार');
    fireEvent.click(fullOwnershipCheckbox);

    fireEvent.click(screen.getByRole('button', { name: 'संपत्ति बिक्री प्रमाण पत्र जमा करें' }));

    // Check if loading state is displayed
    expect(screen.getByText('जमा हो रहा है...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'जमा हो रहा है...' })).toBeDisabled();
  });
});