'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const PropertySaleCertificateForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchasers, setPurchasers] = useState([]);
  const [witnesses, setWitnesses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [floors, setFloors] = useState([]);
  const [purchaserIdx, setPurchaserIdx] = useState(0);
  const [witnessIdx, setWitnessIdx] = useState(0);
  const [paymentIdx, setPaymentIdx] = useState(0);
  const [floorIdx, setFloorIdx] = useState(0);

  const initialValues = {
    // Bank/Secured Creditor Information
    bank_select: '',
    bank_other: '',
    bank_reg_off: '',
    bank_head_off: '',
    bank_pan: '',
    bank_post: '',
    
    // Bank Representative Information
    bank_rep_title: 'श्री',
    bank_rep_name: '',
    bank_rep_rel: 'पुत्र',
    bank_rep_father_name: '',
    bank_rep_occ: '',
    bank_rep_mobile: '',
    bank_rep_email: '',
    bank_rep_addr: '',
    bank_rep_photo: null,

    // Acknowledgement Receipt
    ack_amount: '',
    ack_amount_words: '',

    // Previous Owner Information
    previous_owner: '',
    acquisition_mode: '',
    bank_power: '',

    // Property Details
    prop_category: '',
    prop_subtype: '',
    construction_type: '',
    prop_state: 'Uttar Pradesh',
    prop_tehsil: '',
    prop_ward: '',
    prop_khasra: '',
    prop_plot: '',
    prop_flat_floor: '',
    covered_area: '',
    super_area: '',
    plot_area_val: '',
    plot_area_unit: 'sqm',
    plot_area_sqm: '',
    road_size_val: '',
    road_size_unit: 'sqm',
    road_size_m: '',
    road_double: false,
    park_facing: false,
    corner_plot: false,
    prop_address: '',
    prop_photo: null,
    
    // Boundary Details
    bd_north: '',
    bd_south: '',
    bd_east: '',
    bd_west: '',

    // Circle Rate and Stamp Duty
    circle_rate: '',
    circle_rate_value: '',
    stamp_duty: '',
    registration_fee: '',
    total_property_cost: '',
    stamp_no: '',
    stamp_amount_manual: '',
    stamp_date: '',

    // Legal Details
    legal_rule_select: '',
    legal_clauses: '',
    power_authority: [],

    // Agreement Details
    agreement_no: '',
    agreement_date: '',
    payment_terms: '',

    // Other Details
    advocate_name: '',
    draft_date: new Date().toISOString().split('T')[0],
    
    // Calculated fields
    total_amount: '',
    total_words: '',
    currency_label: 'रुपये मात्र',
  };

  const validationSchema = Yup.object().shape({
    bank_select: Yup.string().required('बैंक का नाम आवश्यक है'),
    bank_reg_off: Yup.string().required('पंजीकृत कार्यालय का पता आवश्यक है'),
    bank_head_off: Yup.string().required('प्रधान कार्यालय आवश्यक है'),
    bank_rep_name: Yup.string().required('बैंक प्रतिनिधि का नाम आवश्यक है'),
    bank_rep_father_name: Yup.string().required('पिता/पति का नाम आवश्यक है'),
    bank_rep_addr: Yup.string().required('पता आवश्यक है'),
    bank_rep_mobile: Yup.string()
      .required('मोबाइल नंबर आवश्यक है')
      .matches(/^[0-9]{10}$/, 'मोबाइल नंबर 10 अंकों का होना चाहिए'),
    bank_rep_email: Yup.string().email('वैध ईमेल आवश्यक है'),
    prop_category: Yup.string().required('संपत्ति श्रेणी आवश्यक है'),
    prop_subtype: Yup.string().required('उपयोग आवश्यक है'),
    prop_address: Yup.string().required('संपत्ति का पता आवश्यक है'),
    prop_state: Yup.string().required('राज्य आवश्यक है'),
    prop_tehsil: Yup.string().required('तहसील आवश्यक है'),
    prop_ward: Yup.string().required('वार्ड/गांव/कॉलोनी आवश्यक है'),
  });

  // Property data for auto-population
  const propertyData = {
    Residential: {
      subtype: ['Flat', 'House', 'Multistory House', 'Villa', 'Penthouse'],
      prop_address: 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली',
      circle_rate: 10000,
      covered_area: 120,
      super_area: 150,
      plot_area_val: 200,
      plot_area_unit: 'sqyd',
      road_size_val: 12,
      road_size_unit: 'sqm',
      bd_north: 'राम शर्मा का घर',
      bd_south: 'मुख्य सड़क',
      bd_east: 'पार्क',
      bd_west: 'शर्मा जी का घर'
    },
    Commercial: {
      subtype: ['Shop', 'Office', 'Showroom', 'Multistory Commercial Building'],
      prop_address: 'राजेंद्र प्लेस, कमला नगर, पुरानी दिल्ली',
      circle_rate: 25000,
      covered_area: 80,
      super_area: 100,
      plot_area_val: 100,
      plot_area_unit: 'sqyd',
      road_size_val: 25,
      road_size_unit: 'sqm',
      bd_north: 'शॉप नं 12',
      bd_south: 'मुख्य सड़क',
      bd_east: 'बैंक',
      bd_west: 'शॉप नं 14'
    },
    Industrial: {
      subtype: ['Factory', 'Warehouse', 'Industrial Shed'],
      prop_address: 'प्लॉट नंबर 15, औद्योगिक क्षेत्र, नोएडा',
      circle_rate: 8000,
      covered_area: 500,
      super_area: 600,
      plot_area_val: 1000,
      plot_area_unit: 'sqyd',
      road_size_val: 30,
      road_size_unit: 'sqm',
      bd_north: 'फैक्ट्री',
      bd_south: 'मुख्य रोड',
      bd_east: 'रेलवे लाइन',
      bd_west: 'खाली प्लॉट'
    },
    Agriculture: {
      subtype: ['Open Plot'],
      prop_address: 'खसरा नंबर 123, गाँव: नंदीग्राम, जिला: गाजियाबाद',
      circle_rate: 5000,
      plot_area_val: 500,
      plot_area_unit: 'sqm',
      road_size_val: 8,
      road_size_unit: 'sqm',
      bd_north: 'सरकारी रास्ता',
      bd_south: 'नदी',
      bd_east: 'राकेश का खेत',
      bd_west: 'सुरेश का खेत'
    }
  };

  const legalData = {
    UP_Land_Revenue: 'उत्तर प्रदेश भू-राजस्व संहिता, 2006 के प्रावधानों के तहत यह हस्तांतरण मान्य है और संपत्ति का स्वामित्व विक्रेता से खरीदार को हस्तांतरित होता है।',
    Indian_Stamp_Act: 'यह बिक्री प्रमाणपत्र भारतीय स्टाम्प अधिनियम, 1899 के प्रावधानों के तहत निष्पादित किया गया है और आवश्यक स्टाम्प शुल्क का भुगतान किया गया है।',
    General_Clauses: 'यह बिक्री प्रमाणपत्र जनरल क्लॉज अधिनियम, 1897 की धारा 10 और 14 के अनुसार कानूनी रूप से बाध्यकारी है।',
    SARFAESI_Act: 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ सिक्योरिटी इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।'
  };

  const locationData = {
    "Uttar Pradesh": {
      "Ghaziabad": ["Noida", "Indirapuram", "Vasundhara", "Khora", "Loni"],
      "Hapur": ["Pillkhuwa", "Garhmukteshwar", "Dhaulana"],
      "Modinagar": ["Muradnagar", "Baghpat"]
    }
  };

  // Helper functions
  const numberToWordsIndian = (num) => {
    if (num === 0) return 'शून्य';
    const a = ['', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ', 'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
    const b = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];
    
    function inWords(n) {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' सौ' + (n % 100 ? ' ' + inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + ' हजार' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' लाख' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
      return inWords(Math.floor(n / 10000000)) + ' करोड़' + (n % 10000000 ? ' ' + inWords(n % 10000000) : '');
    }
    return inWords(num);
  };

  const fmt2 = (n) => {
    return (Number(n) || 0).toFixed(2);
  };

  const previewImage = (input, previewId) => {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      }
      reader.readAsDataURL(input.files[0]);
    } else {
      preview.src = '#';
      preview.style.display = 'none';
    }
  };

  // Dynamic array management functions
  const addPurchaser = () => {
    const newPurchaser = {
      id: Date.now(),
      title: 'श्री',
      name: '',
      rel: 'पुत्र',
      father_name: '',
      addr: '',
      idtype: 'आधार',
      idno: '',
      occ: '',
      pan: '',
      mobile: '',
      email: '',
      photo: null
    };
    setPurchasers([...purchasers, newPurchaser]);
    setPurchaserIdx(purchaserIdx + 1);
  };

  const removePurchaser = (id) => {
    setPurchasers(purchasers.filter(p => p.id !== id));
  };

  const updatePurchaser = (id, field, value) => {
    setPurchasers(purchasers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addWitness = () => {
    const newWitness = {
      id: Date.now(),
      title: 'श्री',
      name: '',
      rel: 'पुत्र',
      father_name: '',
      addr: '',
      idtype: 'आधार',
      idno: '',
      occ: '',
      mobile: '',
      photo: null
    };
    setWitnesses([...witnesses, newWitness]);
    setWitnessIdx(witnessIdx + 1);
  };

  const removeWitness = (id) => {
    setWitnesses(witnesses.filter(w => w.id !== id));
  };

  const updateWitness = (id, field, value) => {
    setWitnesses(witnesses.map(w => 
      w.id === id ? { ...w, [field]: value } : w
    ));
  };

  const addPayment = () => {
    const newPayment = {
      id: Date.now(),
      amount: '',
      mode: '',
      ref: '',
      date: '',
      bank: ''
    };
    setPayments([...payments, newPayment]);
    setPaymentIdx(paymentIdx + 1);
  };

  const removePayment = (id) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const updatePayment = (id, field, value) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addFloor = () => {
    const newFloor = {
      id: Date.now(),
      floor_number: '',
      rooms: []
    };
    setFloors([...floors, newFloor]);
    setFloorIdx(floorIdx + 1);
  };

  const removeFloor = (id) => {
    setFloors(floors.filter(f => f.id !== id));
  };

  const updateFloor = (id, field, value) => {
    setFloors(floors.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const addRoomToFloor = (floorId) => {
    const newRoom = {
      id: Date.now(),
      room_type: '',
      room_count: 1
    };
    setFloors(floors.map(f => 
      f.id === floorId 
        ? { ...f, rooms: [...(f.rooms || []), newRoom] }
        : f
    ));
  };

  const removeRoomFromFloor = (floorId, roomId) => {
    setFloors(floors.map(f => 
      f.id === floorId 
        ? { ...f, rooms: (f.rooms || []).filter(r => r.id !== roomId) }
        : f
    ));
  };

  // Area conversion functions
  const convertPlotArea = (value, unit, setFieldValue) => {
    const val = Number(value) || 0;
    let sqm = 0;
    if (unit === 'sqft') sqm = val * 0.092903;
    else if (unit === 'sqyd') sqm = val * 0.836127;
    else if (unit === 'sqm') sqm = val;
    setFieldValue('plot_area_sqm', fmt2(sqm));
  };

  const convertRoadSize = (value, unit, setFieldValue) => {
    const val = Number(value) || 0;
    let m = 0;
    if (unit === 'sqft') m = val * 0.3048;
    else if (unit === 'sqyd') m = val * 0.9144;
    else if (unit === 'sqm') m = val;
    setFieldValue('road_size_m', fmt2(m));
  };

  // Stamp duty calculation
  const calculateStampDuty = (values, purchasers, setFieldValue) => {
    const circleRate = Number(values.circle_rate) || 0;
    const category = values.prop_category;
    const subtype = values.prop_subtype;

    let chargeableArea = 0;
    if (subtype === 'Flat' || subtype === 'Multistory Commercial Building' || subtype === 'Penthouse') {
      chargeableArea = Number(values.super_area) || 0;
    } else if (category === 'Residential' || category === 'Commercial' || category === 'Industrial') {
      chargeableArea = Number(values.covered_area) || 0;
    } else if (category === 'Agriculture') {
      chargeableArea = Number(values.plot_area_sqm) || 0;
    }

    if (chargeableArea === 0 || circleRate === 0) {
      setFieldValue('circle_rate_value', '');
      setFieldValue('stamp_duty', '');
      setFieldValue('registration_fee', '');
      setFieldValue('total_property_cost', '');
      return;
    }

    const circleRateValue = chargeableArea * circleRate;
    const hasFemalePurchaser = purchasers.some(p => p.title === 'श्रीमती' || p.title === 'सुश्री');
    const stampDutyRate = hasFemalePurchaser ? 0.05 : 0.07;
    const stampDuty = circleRateValue * stampDutyRate;
    const registrationFee = circleRateValue * 0.01;
    const totalCost = circleRateValue + stampDuty + registrationFee;

    setFieldValue('circle_rate_value', fmt2(circleRateValue));
    setFieldValue('stamp_duty', fmt2(stampDuty));
    setFieldValue('registration_fee', fmt2(registrationFee));
    setFieldValue('total_property_cost', fmt2(totalCost));
  };

  // Total calculation
  const calculateTotal = (payments, ackAmount, setFieldValue) => {
    let total = 0;
    payments.forEach(payment => {
      total += Number(payment.amount) || 0;
    });
    total += Number(ackAmount) || 0;
    setFieldValue('total_amount', fmt2(total));
    setFieldValue('total_words', numberToWordsIndian(Math.floor(total)) + ' रुपये मात्र');
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(values).forEach(key => {
        if (values[key] !== null && values[key] !== undefined) {
          if (Array.isArray(values[key])) {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      // Append dynamic arrays
      formData.append('purchasers', JSON.stringify(purchasers));
      formData.append('witnesses', JSON.stringify(witnesses));
      formData.append('payments', JSON.stringify(payments));
      formData.append('floors', JSON.stringify(floors));

      const response = await fetch('/api/property-sale-certificate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('संपत्ति बिक्री प्रमाण पत्र सफलतापूर्वक जमा हो गया!');
        resetForm();
        setPurchasers([]);
        setWitnesses([]);
        setPayments([]);
        setFloors([]);
      } else {
        throw new Error(data.message || 'सबमिशन में त्रुटि हुई');
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.message || 'सबमिशन में त्रुटि हुई। कृपया पुनः प्रयास करें।';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-4">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="bg-blue-600 text-white p-3 rounded-lg mb-4">
            <h1 className="text-lg font-bold text-center">
              संपत्ति बिक्री प्रमाणपत्र जनरेटर
            </h1>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="space-y-4">
                {/* Bank/Secured Creditor Section */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h2 className="text-lg font-semibold text-blue-800 mb-4 border-b border-blue-300 pb-2">
                    सुरक्षित लेनदार / बैंक
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        बैंक का नाम *
                      </label>
                      <Field
                        as="select"
                        name="bank_select"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          setFieldValue('bank_select', e.target.value);
                          setFieldValue('bank_other', e.target.value === 'Other' ? values.bank_other : '');
                        }}
                      >
                        <option value="">-- बैंक चुनें --</option>
                        <option value="SBI">SBI</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                        <option value="Bank of India">Bank of India</option>
                        <option value="Canara Bank">Canara Bank</option>
                        <option value="IDFC First Bank">IDFC First Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Union Bank of India">Union Bank of India</option>
                        <option value="IndusInd Bank">IndusInd Bank</option>
                        <option value="PNB Housing Finance">PNB Housing Finance</option>
                        <option value="Other">अन्य</option>
                      </Field>
                      <ErrorMessage name="bank_select" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {values.bank_select === 'Other' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          यदि अन्य / बैंक का नाम टाइप करें
                        </label>
                        <Field
                          type="text"
                          name="bank_other"
                          placeholder="यदि सूची में नहीं है तो बैंक का नाम टाइप करें"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        पंजीकृत कार्यालय का पता *
                      </label>
                      <Field
                        as="textarea"
                        name="bank_reg_off"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="bank_reg_off" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        प्रधान कार्यालय *
                      </label>
                      <Field
                        type="text"
                        name="bank_head_off"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="bank_head_off" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        बैंक पैन (यदि कोई हो)
                      </label>
                      <Field
                        type="text"
                        name="bank_pan"
                        maxLength={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        पद / पदनाम
                      </label>
                      <Field
                        type="text"
                        name="bank_post"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Bank Representative Section */}
                  <div className="mt-4 pt-4 border-t border-blue-300">
                    <h3 className="text-md font-semibold text-blue-700 mb-3">बैंक प्रतिनिधि (अधिकृत अधिकारी)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">शीर्षक</label>
                        <Field
                          as="select"
                          name="bank_rep_title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="श्री">श्री</option>
                          <option value="श्रीमती">श्रीमती</option>
                          <option value="सुश्री">सुश्री</option>
                        </Field>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">पूरा नाम *</label>
                        <Field
                          type="text"
                          name="bank_rep_name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="bank_rep_name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">संबंध</label>
                        <Field
                          as="select"
                          name="bank_rep_rel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="पुत्र">पुत्र</option>
                          <option value="पत्नी">पत्नी</option>
                          <option value="पुत्री">पुत्री</option>
                          <option value="पुत्र/पुत्री">पुत्र/पुत्री</option>
                          <option value="पत्नी/पति">पत्नी/पति</option>
                          <option value="अन्य">अन्य</option>
                        </Field>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">पिता/पति का नाम *</label>
                        <Field
                          type="text"
                          name="bank_rep_father_name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="bank_rep_father_name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">पेशा</label>
                        <Field
                          type="text"
                          name="bank_rep_occ"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">मोबाइल *</label>
                        <Field
                          type="text"
                          name="bank_rep_mobile"
                          maxLength={10}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="bank_rep_mobile" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">ईमेल</label>
                      <Field
                        type="email"
                        name="bank_rep_email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="bank_rep_email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">प्रतिनिधि का पता *</label>
                      <Field
                        as="textarea"
                        name="bank_rep_addr"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="bank_rep_addr" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        बैंक प्रतिनिधि की पासपोर्ट-साइज़ फ़ोटो अपलोड करें
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setFieldValue('bank_rep_photo', e.target.files[0]);
                          previewImage(e.target, 'bank_rep_photo_preview');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <img id="bank_rep_photo_preview" className="mt-2 max-w-24 max-h-24 border border-gray-300 p-1 rounded" style={{display: 'none'}} alt="Preview" />
                    </div>
                  </div>
                </div>

                {/* Acknowledgement Receipt Section */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h2 className="text-lg font-semibold text-green-800 mb-4 border-b border-green-300 pb-2">
                    अभिस्वीकृति रसीद (Acknowledgement Receipt)
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        रसीद की राशि (₹)
                      </label>
                      <Field
                        type="number"
                        name="ack_amount"
                        min="0"
                        step="any"
                        onChange={(e) => {
                          setFieldValue('ack_amount', e.target.value);
                          setFieldValue('ack_amount_words', e.target.value ? numberToWordsIndian(Math.floor(Number(e.target.value))) + ' रुपये मात्र' : '');
                          calculateTotal(payments, e.target.value, setFieldValue);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        राशि (शब्दों में)
                      </label>
                      <Field
                        type="text"
                        name="ack_amount_words"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Previous Owner Information Section */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h2 className="text-lg font-semibold text-orange-800 mb-4 border-b border-orange-300 pb-2">
                    उत्तराधिकार और पूर्व-स्वामी विवरण
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        पूर्व-स्वामी का नाम
                      </label>
                      <Field
                        type="text"
                        name="previous_owner"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        पूर्व-स्वामी को संपत्ति कैसे मिली (मोड ऑफ एक्विजिशन)
                      </label>
                      <Field
                        type="text"
                        name="acquisition_mode"
                        placeholder="उदाहरण: सेल डीड, विल, गिफ्ट डीड, आदि."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        बैंक को संपत्ति पर अधिकार कैसे मिला (सार्वजनिक नीलामी, SARFAESI अधिनियम, आदि)
                      </label>
                      <Field
                        type="text"
                        name="bank_power"
                        placeholder="उदाहरण: सरफेसी एक्ट, 2002 के तहत"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Property Details Section */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h2 className="text-lg font-semibold text-indigo-800 mb-4 border-b border-indigo-300 pb-2">
                    संपत्ति और निर्माण विवरण
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        संपत्ति श्रेणी *
                      </label>
                      <Field
                        as="select"
                        name="prop_category"
                        onChange={(e) => {
                          setFieldValue('prop_category', e.target.value);
                          if (e.target.value && propertyData[e.target.value]) {
                            const data = propertyData[e.target.value];
                            setFieldValue('prop_address', data.prop_address || '');
                            setFieldValue('circle_rate', data.circle_rate || '');
                            setFieldValue('covered_area', data.covered_area || '');
                            setFieldValue('super_area', data.super_area || '');
                            setFieldValue('plot_area_val', data.plot_area_val || '');
                            setFieldValue('plot_area_unit', data.plot_area_unit || 'sqm');
                            setFieldValue('road_size_val', data.road_size_val || '');
                            setFieldValue('road_size_unit', data.road_size_unit || 'sqm');
                            setFieldValue('bd_north', data.bd_north || '');
                            setFieldValue('bd_south', data.bd_south || '');
                            setFieldValue('bd_east', data.bd_east || '');
                            setFieldValue('bd_west', data.bd_west || '');
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">-- चुनें --</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Agriculture">Agriculture</option>
                      </Field>
                      <ErrorMessage name="prop_category" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        उपयोग (उप-प्रकार) *
                      </label>
                      <Field
                        as="select"
                        name="prop_subtype"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">-- चुनें --</option>
                        {values.prop_category && propertyData[values.prop_category] && 
                          propertyData[values.prop_category].subtype.map(subtype => (
                            <option key={subtype} value={subtype}>{subtype}</option>
                          ))
                        }
                      </Field>
                      <ErrorMessage name="prop_subtype" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {values.prop_category && values.prop_category !== 'Agriculture' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          निर्माण का प्रकार
                        </label>
                        <Field
                          as="select"
                          name="construction_type"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">-- चुनें --</option>
                          <option value="1st Class">1st Class</option>
                          <option value="2nd Class">2nd Class</option>
                          <option value="3rd Class">3rd Class</option>
                          <option value="4th Class">4th Class</option>
                        </Field>
                      </div>
                    )}
                  </div>

                  {/* Property Address */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-indigo-700 mb-2">संपत्ति का पता</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">राज्य *</label>
                        <Field
                          as="select"
                          name="prop_state"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Uttar Pradesh">उत्तर प्रदेश</option>
                        </Field>
                        <ErrorMessage name="prop_state" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">तहसील *</label>
                        <Field
                          as="select"
                          name="prop_tehsil"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">-- चुनें --</option>
                          {locationData["Uttar Pradesh"] && 
                            Object.keys(locationData["Uttar Pradesh"]).map(tehsil => (
                              <option key={tehsil} value={tehsil}>{tehsil}</option>
                            ))
                          }
                        </Field>
                        <ErrorMessage name="prop_tehsil" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">वार्ड / गांव / कॉलोनी *</label>
                        <Field
                          as="select"
                          name="prop_ward"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">-- चुनें --</option>
                          {values.prop_tehsil && locationData["Uttar Pradesh"][values.prop_tehsil] && 
                            locationData["Uttar Pradesh"][values.prop_tehsil].map(ward => (
                              <option key={ward} value={ward}>{ward}</option>
                            ))
                          }
                        </Field>
                        <ErrorMessage name="prop_ward" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">खसरा नं.</label>
                      <Field
                        type="text"
                        name="prop_khasra"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">प्लॉट नं.</label>
                      <Field
                        type="text"
                        name="prop_plot"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {(values.prop_subtype === 'Flat' || values.prop_subtype === 'Multistory House' || values.prop_subtype === 'Multistory Commercial Building' || values.prop_subtype === 'Penthouse') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">फ्लैट / फ़्लोर नं.</label>
                        <Field
                          type="text"
                          name="prop_flat_floor"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Built-up Details */}
                  {(values.prop_category === 'Residential' || values.prop_category === 'Commercial' || values.prop_category === 'Industrial') && (
                    <div className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">कवर्ड एरिया (sq.m)</label>
                          <Field
                            type="number"
                            name="covered_area"
                            min="0"
                            onChange={(e) => {
                              setFieldValue('covered_area', e.target.value);
                              calculateStampDuty({...values, covered_area: e.target.value}, purchasers, setFieldValue);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">सुपर एरिया (sq.m)</label>
                          <Field
                            type="number"
                            name="super_area"
                            min="0"
                            onChange={(e) => {
                              setFieldValue('super_area', e.target.value);
                              calculateStampDuty({...values, super_area: e.target.value}, purchasers, setFieldValue);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Land Details */}
                  {values.prop_category === 'Agriculture' && (
                    <div className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">प्लॉट क्षेत्रफल</label>
                          <Field
                            type="number"
                            name="plot_area_val"
                            min="0"
                            onChange={(e) => {
                              setFieldValue('plot_area_val', e.target.value);
                              convertPlotArea(e.target.value, values.plot_area_unit, setFieldValue);
                              calculateStampDuty({...values, plot_area_val: e.target.value}, purchasers, setFieldValue);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">इकाई चुनें</label>
                          <Field
                            as="select"
                            name="plot_area_unit"
                            onChange={(e) => {
                              setFieldValue('plot_area_unit', e.target.value);
                              convertPlotArea(values.plot_area_val, e.target.value, setFieldValue);
                              calculateStampDuty({...values, plot_area_unit: e.target.value}, purchasers, setFieldValue);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="sqft">sq.ft</option>
                            <option value="sqm">sq.m</option>
                            <option value="sqyd">sq.yd</option>
                          </Field>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">परिवर्तित क्षेत्रफल (sq.m)</label>
                          <Field
                            type="text"
                            name="plot_area_sqm"
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Road Details */}
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">रोड साइज</label>
                        <Field
                          type="number"
                          name="road_size_val"
                          min="0"
                          onChange={(e) => {
                            setFieldValue('road_size_val', e.target.value);
                            convertRoadSize(e.target.value, values.road_size_unit, setFieldValue);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">इकाई चुनें</label>
                        <Field
                          as="select"
                          name="road_size_unit"
                          onChange={(e) => {
                            setFieldValue('road_size_unit', e.target.value);
                            convertRoadSize(values.road_size_val, e.target.value, setFieldValue);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="sqft">sq.ft</option>
                          <option value="sqm">sq.m</option>
                          <option value="sqyd">sq.yd</option>
                        </Field>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">परिवर्तित साइज (meter)</label>
                        <Field
                          type="text"
                          name="road_size_m"
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="road_double"
                          className="mr-2"
                        />
                        डबल साइड रोड
                      </label>
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="park_facing"
                          className="mr-2"
                        />
                        पार्क फेसिंग
                      </label>
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="corner_plot"
                          className="mr-2"
                        />
                        कार्नर प्लॉट
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">पूरा पता / विवरण *</label>
                    <Field
                      as="textarea"
                      name="prop_address"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <ErrorMessage name="prop_address" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      संपत्ति की पोस्टकार्ड-साइज़ फ़ोटो अपलोड करें
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setFieldValue('prop_photo', e.target.files[0]);
                        previewImage(e.target, 'prop_photo_preview');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <img id="prop_photo_preview" className="mt-2 max-w-48 max-h-32 border border-gray-300 p-1 rounded" style={{display: 'none'}} alt="Preview" />
                  </div>

                  {/* Boundary Details */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-indigo-700 mb-2">सीमा विवरण</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">उत्तर दिशा की सीमा</label>
                        <Field
                          type="text"
                          name="bd_north"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">दक्षिण दिशा की सीमा</label>
                        <Field
                          type="text"
                          name="bd_south"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">पूर्व दिशा की सीमा</label>
                        <Field
                          type="text"
                          name="bd_east"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">पश्चिम दिशा की सीमा</label>
                        <Field
                          type="text"
                          name="bd_west"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Circle Rate and Stamp Duty Section */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h2 className="text-lg font-semibold text-yellow-800 mb-4 border-b border-yellow-300 pb-2">
                    सर्किल रेट और स्टाम्प ड्यूटी विवरण (Government Rate)
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        सर्किल रेट (प्रति वर्ग मीटर में)
                      </label>
                      <Field
                        type="number"
                        name="circle_rate"
                        min="0"
                        onChange={(e) => {
                          setFieldValue('circle_rate', e.target.value);
                          calculateStampDuty({...values, circle_rate: e.target.value}, purchasers, setFieldValue);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        संपत्ति का मूल्यांकन
                      </label>
                      <Field
                        type="text"
                        name="circle_rate_value"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        स्टाम्प ड्यूटी
                      </label>
                      <Field
                        type="number"
                        name="stamp_duty"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        पंजीकरण शुल्क (1% पर निर्धारित)
                      </label>
                      <Field
                        type="text"
                        name="registration_fee"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      कुल लागत (बिक्री मूल्य + स्टाम्प ड्यूटी + शुल्क)
                    </label>
                    <Field
                      type="text"
                      name="total_property_cost"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ई-स्टाम्प नं.
                      </label>
                      <Field
                        type="text"
                        name="stamp_no"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        स्टाम्प राशि (₹)
                      </label>
                      <Field
                        type="number"
                        name="stamp_amount_manual"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        स्टाम्प की तारीख
                      </label>
                      <Field
                        type="date"
                        name="stamp_date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Legal Details Section */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h2 className="text-lg font-semibold text-red-800 mb-4 border-b border-red-300 pb-2">
                    कानूनी विवरण
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        लागू नियम और विनियम चुनें
                      </label>
                      <Field
                        as="select"
                        name="legal_rule_select"
                        onChange={(e) => {
                          setFieldValue('legal_rule_select', e.target.value);
                          setFieldValue('legal_clauses', legalData[e.target.value] || '');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">-- कानून चुनें --</option>
                        <option value="UP_Land_Revenue">UP Land Revenue Code, 2006</option>
                        <option value="Indian_Stamp_Act">Indian Stamp Act, 1899</option>
                        <option value="General_Clauses">General Clauses Act, 1897</option>
                        <option value="SARFAESI_Act">SARFAESI Act, 2002</option>
                      </Field>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        अधिकार और शक्तियां
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <Field
                            type="checkbox"
                            name="power_authority"
                            value="full_ownership"
                            className="mr-2"
                          />
                          संपत्ति का पूर्ण स्वामित्व अधिकार
                        </label>
                        <label className="flex items-center">
                          <Field
                            type="checkbox"
                            name="power_authority"
                            value="right_to_mortgage"
                            className="mr-2"
                          />
                          गिरवी रखने का अधिकार
                        </label>
                        <label className="flex items-center">
                          <Field
                            type="checkbox"
                            name="power_authority"
                            value="right_to_sell"
                            className="mr-2"
                          />
                          बेचने का अधिकार
                        </label>
                        <label className="flex items-center">
                          <Field
                            type="checkbox"
                            name="power_authority"
                            value="right_to_lease"
                            className="mr-2"
                          />
                          पट्टे पर देने का अधिकार
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      कानूनी क्लॉज
                    </label>
                    <Field
                      as="textarea"
                      name="legal_clauses"
                      rows={5}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                </div>

                {/* Purchasers Section */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h2 className="text-lg font-semibold text-purple-800 mb-4 border-b border-purple-300 pb-2">
                    खरीददार
                  </h2>
                  
                  <div id="purchaserList">
                    {purchasers.map((purchaser, index) => (
                      <div key={purchaser.id} className="border border-purple-200 p-3 rounded-lg mb-3 bg-white">
                        <div className="flex justify-between items-center mb-3">
                          <strong className="text-purple-700">खरीददार {index + 1}</strong>
                          <button
                            type="button"
                            onClick={() => removePurchaser(purchaser.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          >
                            हटाएँ
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">शीर्षक</label>
                            <select
                              value={purchaser.title}
                              onChange={(e) => updatePurchaser(purchaser.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="श्री">श्री</option>
                              <option value="श्रीमती">श्रीमती</option>
                              <option value="सुश्री">सुश्री</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पूरा नाम</label>
                            <input
                              type="text"
                              value={purchaser.name}
                              onChange={(e) => updatePurchaser(purchaser.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">संबंध</label>
                            <select
                              value={purchaser.rel}
                              onChange={(e) => updatePurchaser(purchaser.id, 'rel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="पुत्र">पुत्र</option>
                              <option value="पत्नी">पत्नी</option>
                              <option value="पुत्री">पुत्री</option>
                              <option value="पुत्र/पुत्री">पुत्र/पुत्री</option>
                              <option value="पत्नी/पति">पत्नी/पति</option>
                              <option value="अन्य">अन्य</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">पिता/पति का नाम</label>
                          <input
                            type="text"
                            value={purchaser.father_name}
                            onChange={(e) => updatePurchaser(purchaser.id, 'father_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">पता</label>
                          <textarea
                            value={purchaser.addr}
                            onChange={(e) => updatePurchaser(purchaser.id, 'addr', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पहचान प्रकार</label>
                            <select
                              value={purchaser.idtype}
                              onChange={(e) => updatePurchaser(purchaser.id, 'idtype', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="आधार">आधार</option>
                              <option value="पैन">पैन</option>
                              <option value="पासपोर्ट">पासपोर्ट</option>
                              <option value="ड्राइविंग लाइसेंस">ड्राइविंग लाइसेंस</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पहचान नंबर</label>
                            <input
                              type="text"
                              value={purchaser.idno}
                              onChange={(e) => updatePurchaser(purchaser.id, 'idno', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पेशा</label>
                            <input
                              type="text"
                              value={purchaser.occ}
                              onChange={(e) => updatePurchaser(purchaser.id, 'occ', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पैन</label>
                            <input
                              type="text"
                              maxLength={10}
                              value={purchaser.pan}
                              onChange={(e) => updatePurchaser(purchaser.id, 'pan', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">मोबाइल</label>
                            <input
                              type="text"
                              maxLength={10}
                              value={purchaser.mobile}
                              onChange={(e) => updatePurchaser(purchaser.id, 'mobile', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ईमेल</label>
                            <input
                              type="email"
                              value={purchaser.email}
                              onChange={(e) => updatePurchaser(purchaser.id, 'email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            पासपोर्ट-साइज़ फ़ोटो अपलोड करें
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              updatePurchaser(purchaser.id, 'photo', e.target.files[0]);
                              previewImage(e.target, `p_photo_preview_${purchaser.id}`);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <img id={`p_photo_preview_${purchaser.id}`} className="mt-2 max-w-24 max-h-24 border border-gray-300 p-1 rounded" style={{display: 'none'}} alt="Preview" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addPurchaser}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      + खरीददार जोड़ें
                    </button>
                  </div>

                  <div className="text-gray-600 text-sm mt-2">
                    प्रत्येक खरीददार: शीर्षक, पूरा नाम, संबंध, पता, पहचान प्रकार/नंबर, पेशा, पैन, मोबाइल, ईमेल, फ़ोटो अपलोड करें
                  </div>
                </div>

                {/* Payments Section */}
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h2 className="text-lg font-semibold text-teal-800 mb-4 border-b border-teal-300 pb-2">
                    भुगतान विवरण
                  </h2>
                  
                  <div id="paymentList">
                    {payments.map((payment, index) => (
                      <div key={payment.id} className="border border-teal-200 p-3 rounded-lg mb-3 bg-white">
                        <div className="flex justify-between items-center mb-3">
                          <strong className="text-teal-700">भुगतान {index + 1}</strong>
                          <button
                            type="button"
                            onClick={() => removePayment(payment.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          >
                            हटाएँ
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">राशि (₹)</label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={payment.amount}
                              onChange={(e) => {
                                updatePayment(payment.id, 'amount', e.target.value);
                                calculateTotal(payments.map(p => p.id === payment.id ? {...p, amount: e.target.value} : p), values.ack_amount, setFieldValue);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">भुगतान का तरीका</label>
                            <input
                              type="text"
                              placeholder="उदाहरण: चेक, NEFT, RTGS"
                              value={payment.mode}
                              onChange={(e) => updatePayment(payment.id, 'mode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">संदर्भ सं.</label>
                            <input
                              type="text"
                              value={payment.ref}
                              onChange={(e) => updatePayment(payment.id, 'ref', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">तारीख</label>
                            <input
                              type="date"
                              value={payment.date}
                              onChange={(e) => updatePayment(payment.id, 'date', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">बैंक</label>
                            <input
                              type="text"
                              value={payment.bank}
                              onChange={(e) => updatePayment(payment.id, 'bank', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addPayment}
                      className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    >
                      + भुगतान जोड़ें
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">कुल राशि (₹)</label>
                      <Field
                        type="text"
                        name="total_amount"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">राशि (शब्दों में)</label>
                      <Field
                        type="text"
                        name="total_words"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">मुद्रा (शब्दों के लिए)</label>
                      <Field
                        type="text"
                        name="currency_label"
                        value="रुपये मात्र"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Agreement Section */}
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h2 className="text-lg font-semibold text-pink-800 mb-4 border-b border-pink-300 pb-2">
                    एग्रीमेंट और भुगतान योजना
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        एग्रीमेंट संख्या
                      </label>
                      <Field
                        type="text"
                        name="agreement_no"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        एग्रीमेंट की तारीख
                      </label>
                      <Field
                        type="date"
                        name="agreement_date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      भुगतान योजना/शर्तें
                    </label>
                    <Field
                      as="textarea"
                      name="payment_terms"
                      rows={3}
                      placeholder="उदाहरण: कुल कीमत 5 किस्तों में भुगतान की गई, आदि."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                {/* Witnesses Section */}
                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                  <h2 className="text-lg font-semibold text-cyan-800 mb-4 border-b border-cyan-300 pb-2">
                    गवाह
                  </h2>
                  
                  <div id="witnessList">
                    {witnesses.map((witness, index) => (
                      <div key={witness.id} className="border border-cyan-200 p-3 rounded-lg mb-3 bg-white">
                        <div className="flex justify-between items-center mb-3">
                          <strong className="text-cyan-700">गवाह {index + 1}</strong>
                          <button
                            type="button"
                            onClick={() => removeWitness(witness.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          >
                            हटाएँ
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">शीर्षक</label>
                            <select
                              value={witness.title}
                              onChange={(e) => updateWitness(witness.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                              <option value="श्री">श्री</option>
                              <option value="श्रीमती">श्रीमती</option>
                              <option value="सुश्री">सुश्री</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पूरा नाम</label>
                            <input
                              type="text"
                              value={witness.name}
                              onChange={(e) => updateWitness(witness.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">संबंध</label>
                            <select
                              value={witness.rel}
                              onChange={(e) => updateWitness(witness.id, 'rel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                              <option value="पुत्र">पुत्र</option>
                              <option value="पत्नी">पत्नी</option>
                              <option value="पुत्री">पुत्री</option>
                              <option value="पुत्र/पुत्री">पुत्र/पुत्री</option>
                              <option value="पत्नी/पति">पत्नी/पति</option>
                              <option value="अन्य">अन्य</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">पिता/पति का नाम</label>
                          <input
                            type="text"
                            value={witness.father_name}
                            onChange={(e) => updateWitness(witness.id, 'father_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">पता</label>
                          <textarea
                            value={witness.addr}
                            onChange={(e) => updateWitness(witness.id, 'addr', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पहचान प्रकार</label>
                            <select
                              value={witness.idtype}
                              onChange={(e) => updateWitness(witness.id, 'idtype', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                              <option value="आधार">आधार</option>
                              <option value="पासपोर्ट">पासपोर्ट</option>
                              <option value="ड्राइविंग लाइसेंस">ड्राइविंग लाइसेंस</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पहचान नंबर</label>
                            <input
                              type="text"
                              value={witness.idno}
                              onChange={(e) => updateWitness(witness.id, 'idno', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">पेशा</label>
                            <input
                              type="text"
                              value={witness.occ}
                              onChange={(e) => updateWitness(witness.id, 'occ', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">मोबाइल</label>
                            <input
                              type="text"
                              maxLength={10}
                              value={witness.mobile}
                              onChange={(e) => updateWitness(witness.id, 'mobile', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            पासपोर्ट-साइज़ फ़ोटो अपलोड करें
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              updateWitness(witness.id, 'photo', e.target.files[0]);
                              previewImage(e.target, `w_photo_preview_${witness.id}`);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                          <img id={`w_photo_preview_${witness.id}`} className="mt-2 max-w-24 max-h-24 border border-gray-300 p-1 rounded" style={{display: 'none'}} alt="Preview" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addWitness}
                      className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                    >
                      + गवाह जोड़ें
                    </button>
                  </div>
                </div>

                {/* Other Details Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                    अन्य विवरण
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        एडवोकेट का नाम
                      </label>
                      <Field
                        type="text"
                        name="advocate_name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ड्राफ्ट प्रिंट होने की तिथि
                      </label>
                      <Field
                        type="date"
                        name="draft_date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-lg font-medium text-white transition-colors text-lg ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? 'जमा हो रहा है...' : 'संपत्ति बिक्री प्रमाण पत्र जमा करें'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default PropertySaleCertificateForm;