import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastContainer } from 'react-toastify';
import PropertyRegistrationForm from '../PropertyRegistrationForm';
import { useRouter } from 'next/navigation';

// Mock Next.js router
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

describe('PropertyRegistrationForm', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
    fetch.mockClear();
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <>
        <PropertyRegistrationForm />
        <ToastContainer />
      </>
    );
  };

  const fillFormData = async () => {
    const user = userEvent.setup();

    // Seller details
    await user.type(screen.getByLabelText(/विक्रेता का नाम/i), 'राम प्रसाद शर्मा');
    await user.type(screen.getByLabelText(/विक्रेता के पिता\/पति का नाम/i), 'शिव प्रसाद शर्मा');
    await user.type(screen.getByLabelText(/विक्रेता का पता/i), 'गाँव रामपुर, जिला गाजियाबाद, उत्तर प्रदेश');
    await user.type(screen.getByLabelText(/विक्रेता का आधार नंबर/i), '123456789012');
    await user.type(screen.getByLabelText(/विक्रेता का मोबाइल नंबर/i), '9876543210');

    // Buyer details
    await user.type(screen.getByLabelText(/खरीदार का नाम/i), 'सीता देवी');
    await user.type(screen.getByLabelText(/खरीदार के पिता\/पति का नाम/i), 'राम कुमार');
    await user.type(screen.getByLabelText(/खरीदार का पता/i), 'गाँव सीतापुर, जिला गाजियाबाद, उत्तर प्रदेश');
    await user.type(screen.getByLabelText(/खरीदार का आधार नंबर/i), '123456789013');
    await user.type(screen.getByLabelText(/खरीदार का मोबाइल नंबर/i), '9876543211');

    // Property details
    await user.type(screen.getByLabelText(/संपत्ति का पता/i), 'प्लॉट नंबर 123, सेक्टर 15, गाजियाबाद, उत्तर प्रदेश');
    await user.selectOptions(screen.getByLabelText(/संपत्ति का प्रकार/i), 'आवासीय');
    await user.type(screen.getByLabelText(/क्षेत्रफल/i), '1200');
    await user.type(screen.getByLabelText(/बिक्री मूल्य/i), '5000000');
    await user.type(screen.getByLabelText(/पंजीकरण की तिथि/i), '2024-01-15');
  };

  describe('Form Rendering', () => {
    it('should render the form with all required fields', () => {
      renderComponent();

      // Check main heading
      expect(screen.getByText('उत्तर प्रदेश संपत्ति पंजीकरण फॉर्म')).toBeInTheDocument();

      // Check section headings
      expect(screen.getByText('विक्रेता/मकान मालिक का विवरण')).toBeInTheDocument();
      expect(screen.getByText('खरीदार का विवरण')).toBeInTheDocument();
      expect(screen.getByText('संपत्ति का विवरण')).toBeInTheDocument();

      // Check seller fields
      expect(screen.getByLabelText(/विक्रेता का नाम/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/विक्रेता के पिता\/पति का नाम/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/विक्रेता का पता/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/विक्रेता का आधार नंबर/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/विक्रेता का मोबाइल नंबर/i)).toBeInTheDocument();

      // Check buyer fields
      expect(screen.getByLabelText(/खरीदार का नाम/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/खरीदार के पिता\/पति का नाम/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/खरीदार का पता/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/खरीदार का आधार नंबर/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/खरीदार का मोबाइल नंबर/i)).toBeInTheDocument();

      // Check property fields
      expect(screen.getByLabelText(/संपत्ति का पता/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/संपत्ति का प्रकार/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/क्षेत्रफल/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/बिक्री मूल्य/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/पंजीकरण की तिथि/i)).toBeInTheDocument();

      // Check submit button
      expect(screen.getByRole('button', { name: /फॉर्म जमा करें/i })).toBeInTheDocument();
    });

    it('should show demo notice', () => {
      renderComponent();
      expect(screen.getByText(/यह फॉर्म केवल एक डेमो है/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /फॉर्म जमा करें/i });
      await user.click(submitButton);

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText(/विक्रेता का नाम आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/विक्रेता के पिता\/पति का नाम आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/विक्रेता का पता आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/विक्रेता का आधार नंबर आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/विक्रेता का मोबाइल नंबर आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/खरीदार का नाम आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/खरीदार के पिता\/पति का नाम आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/खरीदार का पता आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/खरीदार का आधार नंबर आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/खरीदार का मोबाइल नंबर आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/संपत्ति का पता आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/संपत्ति का प्रकार चुनना आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/क्षेत्रफल आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/बिक्री मूल्य आवश्यक है/i)).toBeInTheDocument();
        expect(screen.getByText(/पंजीकरण की तिथि आवश्यक है/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for invalid Aadhaar number', async () => {
      const user = userEvent.setup();
      renderComponent();

      const aadhaarInput = screen.getByLabelText(/विक्रेता का आधार नंबर/i);
      await user.type(aadhaarInput, '12345678901'); // 11 digits instead of 12

      const submitButton = screen.getByRole('button', { name: /फॉर्म जमा करें/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/आधार नंबर 12 अंकों का होना चाहिए/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for invalid mobile number', async () => {
      const user = userEvent.setup();
      renderComponent();

      const mobileInput = screen.getByLabelText(/विक्रेता का मोबाइल नंबर/i);
      await user.type(mobileInput, '987654321'); // 9 digits instead of 10

      const submitButton = screen.getByRole('button', { name: /फॉर्म जमा करें/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/मोबाइल नंबर 10 अंकों का होना चाहिए/i)).toBeInTheDocument();
      });
    });

    it('should clear validation errors when valid data is entered', async () => {
      const user = userEvent.setup();
      renderComponent();

      // First, trigger validation errors
      const submitButton = screen.getByRole('button', { name: /फॉर्म जमा करें/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/विक्रेता का नाम आवश्यक है/i)).toBeInTheDocument();
      });

      // Then fill with valid data
      const nameInput = screen.getByLabelText(/विक्रेता का नाम/i);
      await user.type(nameInput, 'राम प्रसाद शर्मा');

      // Validation error should clear
      await waitFor(() => {
        expect(screen.queryByText(/विक्रेता का नाम आवश्यक है/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form successfully with valid data', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Mock successful API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          message: 'Property registration created successfully',
          data: {
            id: '507f1f77bcf86cd799439011',
            registration_number: 'PR439011',
            status: 'pending',
            created_at: '2024-01-15T10:00:00Z'
          }
        }),
      });

      // Fill form with valid data
      await fillFormData();

      // Submit form
      const submitButton = screen.getByRole('button', { name: /फॉर्म जमा करें/i });
      await user.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByText(/जमा हो रहा है/i)).toBeInTheDocument();
      });

      // Wait for success
      await waitFor(() => {
        expect(screen.getByText(/संपत्ति पंजीकरण सफलतापूर्वक जमा हो गया/i)).toBeInTheDocument();
      });

      // Verify API call
      expect(fetch).toHaveBeenCalledWith('/api/property-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seller_name: 'राम प्रसाद शर्मा',
          seller_father_name: 'शिव प्रसाद शर्मा',
          seller_address: 'गाँव रामपुर, जिला गाजियाबाद, उत्तर प्रदेश',
          seller_aadhaar: '123456789012',
          seller_mobile: '9876543210',
          buyer_name: 'सीता देवी',
          buyer_father_name: 'राम कुमार',
          buyer_address: 'गाँव सीतापुर, जिला गाजियाबाद, उत्तर प्रदेश',
          buyer_aadhaar: '123456789013',
          buyer_mobile: '9876543211',
          property_address: 'प्लॉट नंबर 123, सेक्टर 15, गाजियाबाद, उत्तर प्रदेश',
          property_type: 'आवासीय',
          area_sqm: '1200',
          sale_price: '5000000',
          registration_date: '2024-01-15'
        }),
      });
    });

    it('should handle API error gracefully', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Mock API error response
      fetch.mockRejectedValueOnce(new Error('Network error'));

      // Fill form with valid data
      await fillFormData();

      // Submit form
      const submitButton = screen.getByRole('button', { name: /फॉर्म जमा करें/i });
      await user.click(submitButton);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/सबमिशन में त्रुटि हुई। कृपया पुनः प्रयास करें/i)).toBeInTheDocument();
      });
    });

    it('should handle server error response', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Mock server error response
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          status: 'failed',
          message: 'Validation failed',
          errors: [{ field: 'seller_name', message: 'Invalid name format' }]
        }),
      });

      // Fill form with valid data
      await fillFormData();

      // Submit form
      const submitButton = screen.getByRole('button', { name: /फॉर्म जमा करें/i });
      await user.click(submitButton);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/Validation failed/i)).toBeInTheDocument();
      });
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Mock delayed API response
      fetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ status: 'success' })
        }), 100))
      );

      // Fill form with valid data
      await fillFormData();

      // Submit form
      const submitButton = screen.getByRole('button', { name: /फॉर्म जमा करें/i });
      await user.click(submitButton);

      // Check button is disabled during submission
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent(/जमा हो रहा है/i);
      });
    });
  });

  describe('Form Reset', () => {
    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Mock successful API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          message: 'Property registration created successfully',
          data: { id: '507f1f77bcf86cd799439011' }
        }),
      });

      // Fill form with valid data
      await fillFormData();

      // Submit form
      const submitButton = screen.getByRole('button', { name: /फॉर्म जमा करें/i });
      await user.click(submitButton);

      // Wait for success and form reset
      await waitFor(() => {
        expect(screen.getByLabelText(/विक्रेता का नाम/i)).toHaveValue('');
        expect(screen.getByLabelText(/खरीदार का नाम/i)).toHaveValue('');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      renderComponent();

      // Check that all inputs have associated labels
      expect(screen.getByLabelText(/विक्रेता का नाम/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/विक्रेता के पिता\/पति का नाम/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/विक्रेता का पता/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/विक्रेता का आधार नंबर/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/विक्रेता का मोबाइल नंबर/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/खरीदार का नाम/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/खरीदार के पिता\/पति का नाम/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/खरीदार का पता/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/खरीदार का आधार नंबर/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/खरीदार का मोबाइल नंबर/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/संपत्ति का पता/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/संपत्ति का प्रकार/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/क्षेत्रफल/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/बिक्री मूल्य/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/पंजीकरण की तिथि/i)).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      renderComponent();

      // Check form element exists
      expect(screen.getByRole('form')).toBeInTheDocument();

      // Check submit button
      expect(screen.getByRole('button', { name: /फॉर्म जमा करें/i })).toBeInTheDocument();
    });
  });
});
