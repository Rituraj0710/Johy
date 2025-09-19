"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CameraCapture from "./CameraCapture";

const AdoptionDeedForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    // Registration Details
    country: "भारत",
    state: "",
    district: "",
    tehsil: "",
    subRegistrarOffice: "",
    
    // Child Details
    childName: "",
    childDOB: "",
    childGender: "",
    childBloodGroup: "",
    childEducation: "",
    childCurrentAddress: "",
    childBirthCertNo: "",
    childBirthCertIssueDate: "",
    childBirthCertIssuePlace: "",
    isOrphanageAdoption: false,
    orphanageName: "",
    orphanageAddress: "",
    
    // Stamp Details
    stampAmount: "",
    stampNo: "",
    stampDate: "",
  });

  // Dynamic arrays
  const [firstParties, setFirstParties] = useState([]);
  const [secondParties, setSecondParties] = useState([]);
  const [witnesses, setWitnesses] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Location data
  const states = ['उत्तर प्रदेश', 'दिल्ली', 'महाराष्ट्र'];
  const districts = {
    'उत्तर प्रदेश': ['लखनऊ', 'गाज़ियाबाद', 'कानपुर', 'प्रयागराज'],
    'दिल्ली': ['नई दिल्ली', 'उत्तर दिल्ली', 'दक्षिण दिल्ली'],
    'महाराष्ट्र': ['मुंबई', 'पुणे', 'नागपुर']
  };
  const tehsils = {
    'लखनऊ': ['सरोजिनी नगर', 'मोहनलालगंज'],
    'गाज़ियाबाद': ['गाज़ियाबाद सदर', 'मोदीनगर'],
    'कानपुर': ['कानपुर सदर'],
    'प्रयागराज': ['प्रयागराज सदर'],
    'नई दिल्ली': ['चाणक्यपुरी', 'दिल्ली कैंट'],
    'उत्तर दिल्ली': ['मॉडल टाउन', 'नरेला'],
    'दक्षिण दिल्ली': ['साकेत', 'हौज खास']
  };
  const offices = {
    'गाज़ियाबाद सदर': ['राज नगर सब-रजिस्ट्रार', 'कविनगर सब-रजिस्ट्रार'],
    'मोदीनगर': ['मोदीनगर सब-रजिस्ट्रार'],
    'लखनऊ': ['लखनऊ सब-रजिस्ट्रार'],
    'कानपुर सदर': ['कानपुर सदर सब-रजिस्ट्रार'],
    'प्रयागराज सदर': ['प्रयागराज सदर सब-रजिस्ट्रार'],
    'चाणक्यपुरी': ['चाणक्यपुरी सब-रजिस्ट्रार'],
    'मॉडल टाउन': ['मॉडल टाउन सब-रजिस्ट्रार'],
    'साकेत': ['साकेत सब-रजिस्ट्रार']
  };

  const prefixes = {
    'पुरुष': ['श्री', 'कुमार'],
    'महिला': ['श्रीमती', 'कुमारी']
  };

  // Validation function
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'state':
      case 'district':
      case 'tehsil':
      case 'subRegistrarOffice':
        if (!value) error = 'This field is required';
        break;
      case 'childName':
        if (!value) error = 'Child name is required';
        else if (value.length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'childDOB':
        if (!value) error = 'Date of birth is required';
        else if (new Date(value) > new Date()) error = 'Date cannot be in the future';
        break;
      case 'childGender':
      case 'childBloodGroup':
        if (!value) error = 'Please select an option';
        break;
      case 'childEducation':
        if (!value) error = 'Education details are required';
        break;
      case 'childCurrentAddress':
        if (!value) error = 'Current address is required';
        else if (value.length < 10) error = 'Address must be at least 10 characters';
        break;
      case 'childBirthCertNo':
        if (!value) error = 'Birth certificate number is required';
        break;
      case 'stampAmount':
        if (!value) error = 'Stamp amount is required';
        else if (isNaN(value) || value <= 0) error = 'Please enter a valid amount';
        break;
      case 'stampNo':
        if (!value) error = 'Stamp number is required';
        break;
      case 'stampDate':
        if (!value) error = 'Stamp date is required';
        break;
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate main form fields
    Object.keys(formData).forEach(field => {
      if (field !== 'isOrphanageAdoption' && field !== 'orphanageName' && field !== 'orphanageAddress') {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    // Validate orphanage fields if applicable
    if (formData.isOrphanageAdoption) {
      if (!formData.orphanageName) newErrors.orphanageName = 'Orphanage name is required';
      if (!formData.orphanageAddress) newErrors.orphanageAddress = 'Orphanage address is required';
    }

    // Validate parties
    if (firstParties.length === 0) {
      newErrors.firstParties = 'At least one adopting party (First Party) is required';
    }

    firstParties.forEach((party, index) => {
      ['name', 'gender', 'prefix', 'dob', 'maritalStatus', 'sonOf', 'mobile', 'occupation', 'idType', 'idNo', 'address'].forEach(field => {
        if (!party[field]) {
          newErrors[`firstParty_${index}_${field}`] = 'This field is required';
        }
      });
      
      if (party.maritalStatus === 'विवाहित' && !party.spouseConsent) {
        newErrors[`firstParty_${index}_spouseConsent`] = 'Spouse consent is required for married persons';
      }
    });

    if (!formData.isOrphanageAdoption && secondParties.length === 0) {
      newErrors.secondParties = 'At least one natural parent (Second Party) is required';
    }

    secondParties.forEach((party, index) => {
      ['name', 'gender', 'prefix', 'dob', 'sonOf', 'mobile', 'occupation', 'idType', 'idNo', 'address'].forEach(field => {
        if (!party[field]) {
          newErrors[`secondParty_${index}_${field}`] = 'This field is required';
        }
      });
    });

    // Validate witnesses
    if (witnesses.length === 0) {
      newErrors.witnesses = 'At least one witness is required';
    }

    witnesses.forEach((witness, index) => {
      ['name', 'gender', 'prefix', 'sonOf', 'mobile', 'occupation', 'idType', 'idNo', 'address'].forEach(field => {
        if (!witness[field]) {
          newErrors[`witness_${index}_${field}`] = 'This field is required';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file uploads
  const handleFileChange = (fieldName, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewPhotos(prev => ({
          ...prev,
          [fieldName]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
      
      setUploadedFiles(prev => [...prev, { field: fieldName, file }]);
    }
  };

  // Handle camera capture
  const handleCameraCapture = (fieldName, file, imageSrc) => {
    setPreviewPhotos(prev => ({
      ...prev,
      [fieldName]: imageSrc
    }));
    
    setUploadedFiles(prev => [...prev, { field: fieldName, file }]);
  };

  // Calculate age
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    const ageDiffMs = today - birthDate;
    const years = Math.floor(ageDiffMs / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((ageDiffMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    return `${years} वर्ष ${months} महीने`;
  };

  // Add party functions
  const addFirstParty = () => {
    setFirstParties(prev => [...prev, {
      name: '',
      gender: '',
      prefix: '',
      dob: '',
      maritalStatus: '',
      spouseConsent: false,
      sonOf: '',
      mobile: '',
      occupation: '',
      idType: '',
      idNo: '',
      address: ''
    }]);
  };

  const addSecondParty = () => {
    if (formData.isOrphanageAdoption) {
      toast.warning("अनाथ आश्रम से दत्तक ग्रहण के मामले में, केवल दत्तक लेने वाले (प्रथम पक्ष) की जानकारी ही भरी जानी चाहिए।");
      return;
    }
    setSecondParties(prev => [...prev, {
      name: '',
      gender: '',
      prefix: '',
      dob: '',
      sonOf: '',
      mobile: '',
      occupation: '',
      idType: '',
      idNo: '',
      address: ''
    }]);
  };

  const addWitness = () => {
    setWitnesses(prev => [...prev, {
      name: '',
      gender: '',
      prefix: '',
      sonOf: '',
      mobile: '',
      occupation: '',
      idType: '',
      idNo: '',
      address: ''
    }]);
  };

  const addGift = () => {
    setGifts(prev => [...prev, { description: '' }]);
  };

  // Remove functions
  const removeFirstParty = (index) => {
    setFirstParties(prev => prev.filter((_, i) => i !== index));
  };

  const removeSecondParty = (index) => {
    setSecondParties(prev => prev.filter((_, i) => i !== index));
  };

  const removeWitness = (index) => {
    setWitnesses(prev => prev.filter((_, i) => i !== index));
  };

  const removeGift = (index) => {
    setGifts(prev => prev.filter((_, i) => i !== index));
  };

  // Update party data
  const updateFirstParty = (index, field, value) => {
    setFirstParties(prev => prev.map((party, i) => 
      i === index ? { ...party, [field]: value } : party
    ));
  };

  const updateSecondParty = (index, field, value) => {
    setSecondParties(prev => prev.map((party, i) => 
      i === index ? { ...party, [field]: value } : party
    ));
  };

  const updateWitness = (index, field, value) => {
    setWitnesses(prev => prev.map((witness, i) => 
      i === index ? { ...witness, [field]: value } : witness
    ));
  };

  const updateGift = (index, value) => {
    setGifts(prev => prev.map((gift, i) => 
      i === index ? { ...gift, description: value } : gift
    ));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      const dataToSave = {
        ...formData,
        firstParties,
        secondParties,
        witnesses,
        gifts,
        formType: 'adoption-deed'
      };

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(dataToSave));

      // Add uploaded files
      uploadedFiles.forEach((fileObj, index) => {
        formDataToSend.append(`file_${index}`, fileObj.file);
      });

      // Submit to backend
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4001';
      const response = await fetch(`${API_BASE}/api/adoption-deed`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const result = await response.json();
      toast.success("Adoption Deed form submitted successfully!");
      console.log('Form submitted:', result);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 border-b-4 border-blue-600 pb-4">
            दत्तक ग्रहण पत्र (Adoption Deed)
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Registration Details Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">
                पंजीकरण विवरण
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    देश <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="भारत">भारत</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    राज्य <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- चुनें --</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    जिला <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.state}
                  >
                    <option value="">-- चुनें --</option>
                    {formData.state && districts[formData.state]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    तहसील <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tehsil"
                    value={formData.tehsil}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.district}
                  >
                    <option value="">-- चुनें --</option>
                    {formData.district && tehsils[formData.district]?.map(tehsil => (
                      <option key={tehsil} value={tehsil}>{tehsil}</option>
                    ))}
                  </select>
                  {errors.tehsil && <p className="text-red-500 text-sm mt-1">{errors.tehsil}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    उप-निबंधक कार्यालय <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subRegistrarOffice"
                    value={formData.subRegistrarOffice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.tehsil}
                  >
                    <option value="">-- चुनें --</option>
                    {formData.tehsil && offices[formData.tehsil]?.map(office => (
                      <option key={office} value={office}>{office}</option>
                    ))}
                  </select>
                  {errors.subRegistrarOffice && <p className="text-red-500 text-sm mt-1">{errors.subRegistrarOffice}</p>}
                </div>
              </div>
            </div>

            {/* Child Details Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">
                गोद लिए जाने वाले बच्चे का विवरण
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    फोटो अपलोड करें <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('childPhoto', e.target.files[0])}
                      className="w-full md:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="w-24 h-24 border border-gray-300 rounded flex items-center justify-center bg-gray-50 flex-shrink-0">
                      {previewPhotos.childPhoto ? (
                        <img
                          src={previewPhotos.childPhoto}
                          alt="Child Photo Preview"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-xs text-gray-500 text-center">Photo Preview</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Camera Capture Option */}
                  <div className="mt-4">
                    <CameraCapture
                      onCapture={(file, imageSrc) => handleCameraCapture('childPhoto', file, imageSrc)}
                      label="Capture Child Photo"
                      previewLabel="Child Photo Preview"
                      width={280}
                      height={200}
                      aspectRatio={4/3}
                      compact={true}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    बच्चे का नाम <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.childName && <p className="text-red-500 text-sm mt-1">{errors.childName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    जन्म तिथि <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="childDOB"
                    value={formData.childDOB}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {formData.childDOB && (
                    <p className="text-sm text-gray-600 mt-1">
                      उम्र: {calculateAge(formData.childDOB)}
                    </p>
                  )}
                  {errors.childDOB && <p className="text-red-500 text-sm mt-1">{errors.childDOB}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    लिंग <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="childGender"
                    value={formData.childGender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- चुनें --</option>
                    <option value="पुरुष">पुरुष</option>
                    <option value="महिला">महिला</option>
                    <option value="अन्य">अन्य</option>
                  </select>
                  {errors.childGender && <p className="text-red-500 text-sm mt-1">{errors.childGender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ब्लड ग्रुप <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="childBloodGroup"
                    value={formData.childBloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- चुनें --</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                  {errors.childBloodGroup && <p className="text-red-500 text-sm mt-1">{errors.childBloodGroup}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    शिक्षा का विवरण <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="childEducation"
                    value={formData.childEducation}
                    onChange={handleInputChange}
                    placeholder="जैसे: कक्षा 5, सरस्वती विद्या मंदिर"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.childEducation && <p className="text-red-500 text-sm mt-1">{errors.childEducation}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    वर्तमान पता <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="childCurrentAddress"
                    value={formData.childCurrentAddress}
                    onChange={handleInputChange}
                    placeholder="पूरा पता"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.childCurrentAddress && <p className="text-red-500 text-sm mt-1">{errors.childCurrentAddress}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    जन्म प्रमाण पत्र नंबर <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="childBirthCertNo"
                    value={formData.childBirthCertNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.childBirthCertNo && <p className="text-red-500 text-sm mt-1">{errors.childBirthCertNo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    जारी करने की तिथि <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="childBirthCertIssueDate"
                    value={formData.childBirthCertIssueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    जारी करने का स्थान <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="childBirthCertIssuePlace"
                    value={formData.childBirthCertIssuePlace}
                    onChange={handleInputChange}
                    placeholder="जैसे: नगर निगम कार्यालय, लखनऊ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    जन्म प्रमाण पत्र अपलोड करें <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('childBirthCert', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    पहचान पत्र अपलोड करें <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('childID', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isOrphanageAdoption"
                      checked={formData.isOrphanageAdoption}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      अनाथ आश्रम से दत्तक ग्रहण
                    </label>
                  </div>
                </div>

                {formData.isOrphanageAdoption && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        अनाथ आश्रम का नाम <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="orphanageName"
                        value={formData.orphanageName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.orphanageName && <p className="text-red-500 text-sm mt-1">{errors.orphanageName}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        अनाथ आश्रम का पता <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="orphanageAddress"
                        value={formData.orphanageAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.orphanageAddress && <p className="text-red-500 text-sm mt-1">{errors.orphanageAddress}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Parties Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">
                पक्षकारों का विवरण (प्रथम पक्ष और द्वितीय पक्ष)
              </h2>
              
              <div className="space-y-6">
                {/* First Parties */}
                {firstParties.map((party, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      प्रथम पक्ष (दत्तक लेने वाला) #{index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          फोटो अपलोड करें <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(`firstPartyPhoto_${index}`, e.target.files[0])}
                            className="w-full md:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="w-24 h-24 border border-gray-300 rounded flex items-center justify-center bg-gray-50 flex-shrink-0">
                            {previewPhotos[`firstPartyPhoto_${index}`] ? (
                              <img
                                src={previewPhotos[`firstPartyPhoto_${index}`]}
                                alt="Party Photo Preview"
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <span className="text-xs text-gray-500 text-center">Photo Preview</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <CameraCapture
                            onCapture={(file, imageSrc) => handleCameraCapture(`firstPartyPhoto_${index}`, file, imageSrc)}
                            label="Capture Party Photo"
                            previewLabel="Party Photo Preview"
                            width={280}
                            height={200}
                            aspectRatio={4/3}
                            compact={true}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          लिंग <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={party.gender}
                          onChange={(e) => updateFirstParty(index, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="पुरुष">पुरुष</option>
                          <option value="महिला">महिला</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          उपाधि <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={party.prefix}
                          onChange={(e) => updateFirstParty(index, 'prefix', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          {party.gender && prefixes[party.gender]?.map(prefix => (
                            <option key={prefix} value={prefix}>{prefix}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          नाम <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={party.name}
                          onChange={(e) => updateFirstParty(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          जन्म तिथि <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={party.dob}
                          onChange={(e) => updateFirstParty(index, 'dob', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          वैवाहिक स्थिति <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={party.maritalStatus}
                          onChange={(e) => updateFirstParty(index, 'maritalStatus', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="अविवाहित">अविवाहित</option>
                          <option value="विवाहित">विवाहित</option>
                          <option value="तलाकशुदा">तलाकशुदा</option>
                          <option value="विधवा/विधुर">विधवा/विधुर</option>
                        </select>
                      </div>

                      {party.maritalStatus === 'विवाहित' && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={party.spouseConsent}
                              onChange={(e) => updateFirstParty(index, 'spouseConsent', e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                              पति/पत्नी की सहमति प्राप्त है <span className="text-red-500">*</span>
                            </label>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पिता/पति का नाम <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={party.sonOf}
                          onChange={(e) => updateFirstParty(index, 'sonOf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          मोबाइल नंबर <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={party.mobile}
                          onChange={(e) => updateFirstParty(index, 'mobile', e.target.value)}
                          pattern="[0-9]{10}"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          व्यवसाय <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={party.occupation}
                          onChange={(e) => updateFirstParty(index, 'occupation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="सरकारी कर्मचारी">सरकारी कर्मचारी</option>
                          <option value="निजी क्षेत्र">निजी क्षेत्र</option>
                          <option value="व्यवसाय">व्यवसाय</option>
                          <option value="अन्य">अन्य</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पहचान पत्र का प्रकार <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={party.idType}
                          onChange={(e) => updateFirstParty(index, 'idType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="आधार कार्ड">आधार कार्ड</option>
                          <option value="पैन कार्ड">पैन कार्ड</option>
                          <option value="पासपोर्ट">पासपोर्ट</option>
                          <option value="मतदाता पहचान पत्र">मतदाता पहचान पत्र</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पहचान पत्र नंबर <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={party.idNo}
                          onChange={(e) => updateFirstParty(index, 'idNo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          वर्तमान पता <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={party.address}
                          onChange={(e) => updateFirstParty(index, 'address', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeFirstParty(index)}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      हटाएं
                    </button>
                  </div>
                ))}

                {/* Second Parties */}
                {!formData.isOrphanageAdoption && secondParties.map((party, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      द्वितीय पक्ष (प्राकृतिक माता-पिता) #{index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          फोटो अपलोड करें <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(`secondPartyPhoto_${index}`, e.target.files[0])}
                            className="w-full md:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="w-24 h-24 border border-gray-300 rounded flex items-center justify-center bg-gray-50 flex-shrink-0">
                            {previewPhotos[`secondPartyPhoto_${index}`] ? (
                              <img
                                src={previewPhotos[`secondPartyPhoto_${index}`]}
                                alt="Party Photo Preview"
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <span className="text-xs text-gray-500 text-center">Photo Preview</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          लिंग <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={party.gender}
                          onChange={(e) => updateSecondParty(index, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="पुरुष">पुरुष</option>
                          <option value="महिला">महिला</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          उपाधि <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={party.prefix}
                          onChange={(e) => updateSecondParty(index, 'prefix', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          {party.gender && prefixes[party.gender]?.map(prefix => (
                            <option key={prefix} value={prefix}>{prefix}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          नाम <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={party.name}
                          onChange={(e) => updateSecondParty(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          जन्म तिथि <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={party.dob}
                          onChange={(e) => updateSecondParty(index, 'dob', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पिता/पति का नाम <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={party.sonOf}
                          onChange={(e) => updateSecondParty(index, 'sonOf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          मोबाइल नंबर <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={party.mobile}
                          onChange={(e) => updateSecondParty(index, 'mobile', e.target.value)}
                          pattern="[0-9]{10}"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          व्यवसाय <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={party.occupation}
                          onChange={(e) => updateSecondParty(index, 'occupation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="सरकारी कर्मचारी">सरकारी कर्मचारी</option>
                          <option value="निजी क्षेत्र">निजी क्षेत्र</option>
                          <option value="व्यवसाय">व्यवसाय</option>
                          <option value="अन्य">अन्य</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पहचान पत्र का प्रकार <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={party.idType}
                          onChange={(e) => updateSecondParty(index, 'idType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="आधार कार्ड">आधार कार्ड</option>
                          <option value="पैन कार्ड">पैन कार्ड</option>
                          <option value="पासपोर्ट">पासपोर्ट</option>
                          <option value="मतदाता पहचान पत्र">मतदाता पहचान पत्र</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पहचान पत्र नंबर <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={party.idNo}
                          onChange={(e) => updateSecondParty(index, 'idNo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          वर्तमान पता <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={party.address}
                          onChange={(e) => updateSecondParty(index, 'address', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeSecondParty(index)}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      हटाएं
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <button
                  type="button"
                  onClick={addFirstParty}
                  className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors font-semibold"
                >
                  प्रथम पक्ष (दत्तक लेने वाला) जोड़ें
                </button>
                {!formData.isOrphanageAdoption && (
                  <button
                    type="button"
                    onClick={addSecondParty}
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors font-semibold"
                  >
                    द्वितीय पक्ष (प्राकृतिक माता-पिता) जोड़ें
                  </button>
                )}
              </div>
            </div>

            {/* Witnesses Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">
                गवाह का विवरण
              </h2>
              
              <div className="space-y-6">
                {witnesses.map((witness, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      गवाह #{index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          फोटो अपलोड करें <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(`witnessPhoto_${index}`, e.target.files[0])}
                            className="w-full md:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="w-24 h-24 border border-gray-300 rounded flex items-center justify-center bg-gray-50 flex-shrink-0">
                            {previewPhotos[`witnessPhoto_${index}`] ? (
                              <img
                                src={previewPhotos[`witnessPhoto_${index}`]}
                                alt="Witness Photo Preview"
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <span className="text-xs text-gray-500 text-center">Photo Preview</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          लिंग <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={witness.gender}
                          onChange={(e) => updateWitness(index, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="पुरुष">पुरुष</option>
                          <option value="महिला">महिला</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          उपाधि <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={witness.prefix}
                          onChange={(e) => updateWitness(index, 'prefix', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          {witness.gender && prefixes[witness.gender]?.map(prefix => (
                            <option key={prefix} value={prefix}>{prefix}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          नाम <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={witness.name}
                          onChange={(e) => updateWitness(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पिता/पति का नाम <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={witness.sonOf}
                          onChange={(e) => updateWitness(index, 'sonOf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          मोबाइल नंबर <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={witness.mobile}
                          onChange={(e) => updateWitness(index, 'mobile', e.target.value)}
                          pattern="[0-9]{10}"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          व्यवसाय <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={witness.occupation}
                          onChange={(e) => updateWitness(index, 'occupation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="सरकारी कर्मचारी">सरकारी कर्मचारी</option>
                          <option value="निजी क्षेत्र">निजी क्षेत्र</option>
                          <option value="व्यवसाय">व्यवसाय</option>
                          <option value="अन्य">अन्य</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पहचान पत्र का प्रकार <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={witness.idType}
                          onChange={(e) => updateWitness(index, 'idType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- चुनें --</option>
                          <option value="आधार कार्ड">आधार कार्ड</option>
                          <option value="पैन कार्ड">पैन कार्ड</option>
                          <option value="पासपोर्ट">पासपोर्ट</option>
                          <option value="मतदाता पहचान पत्र">मतदाता पहचान पत्र</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पहचान पत्र नंबर <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={witness.idNo}
                          onChange={(e) => updateWitness(index, 'idNo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          वर्तमान पता <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={witness.address}
                          onChange={(e) => updateWitness(index, 'address', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeWitness(index)}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      हटाएं
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addWitness}
                className="mt-6 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors font-semibold"
              >
                गवाह जोड़ें
              </button>
            </div>

            {/* Rules and Conditions Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">
                दत्तक ग्रहण के नियम और शर्तें
              </h2>
              
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>यह दत्तक ग्रहण हिंदू दत्तक तथा भरण-पोषण अधिनियम, 1956 के प्रावधानों के तहत किया जा रहा है।</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>दत्तक लेने वाला व्यक्ति स्वस्थ मन का, नाबालिग नहीं, और सक्षम है।</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>प्राकृतिक माता-पिता स्वेच्छा से और बिना किसी दबाव या आर्थिक लाभ के यह निर्णय ले रहे हैं।</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>बच्चे की उम्र, लिंग, और कानूनी संबंधों से संबंधित सभी शर्तें पूरी होती हैं।</span>
                </li>
                {formData.isOrphanageAdoption && (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>यह दत्तक ग्रहण CARA (Central Adoption Resource Authority) के नियमों के अनुसार किया जा रहा है।</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>अनाथ आश्रम के सभी कानूनी दस्तावेज, जिसमें आश्रम का पंजीकरण प्रमाण पत्र भी शामिल है, सही और वैध हैं।</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>दत्तक ग्रहण की यह प्रक्रिया बाल कल्याण समिति (Child Welfare Committee) की देखरेख में पूरी की गई है।</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Stamp and Gifts Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">
                स्टाम्प शुल्क और उपहार विवरण
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    स्टाम्प शुल्क राशि <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stampAmount"
                    value={formData.stampAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.stampAmount && <p className="text-red-500 text-sm mt-1">{errors.stampAmount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    स्टाम्प नंबर <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="stampNo"
                    value={formData.stampNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.stampNo && <p className="text-red-500 text-sm mt-1">{errors.stampNo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    स्टाम्प तिथि <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="stampDate"
                    value={formData.stampDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.stampDate && <p className="text-red-500 text-sm mt-1">{errors.stampDate}</p>}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">दिए गए उपहार (Gifts)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>नोट:</strong> ये उपहार कानूनी रूप से केवल प्रतीकात्मक माने जाते हैं और कोई आर्थिक लेनदेन नहीं है।
                </p>
                
                <div className="space-y-4">
                  {gifts.map((gift, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <input
                        type="text"
                        value={gift.description}
                        onChange={(e) => updateGift(index, e.target.value)}
                        placeholder="उपहार का विवरण"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeGift(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                      >
                        हटाएं
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addGift}
                  className="mt-4 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors font-semibold"
                >
                  उपहार जोड़ें
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isLoading ? 'Submitting...' : 'Submit Adoption Deed'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdoptionDeedForm;
 