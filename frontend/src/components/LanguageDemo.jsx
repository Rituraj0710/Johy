"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSelectorDropdown from "./LanguageSelectorDropdown";
import TranslatedFormField from "./TranslatedFormField";

const LanguageDemo = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <LanguageSelectorDropdown />
          </div>

          {/* Demo Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 border-b-4 border-blue-600 pb-4">
            {t('common.language')} {t('forms.title')} Demo
          </h1>

          {/* Demo Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {t('trustDeed.trustDetails')}
              </h2>
              
              <TranslatedFormField
                name="trustName"
                label="t:trustDeed.trustName"
                placeholder="t:trustDeed.placeholders.trustName"
                required
              />
              
              <TranslatedFormField
                name="trustAddress"
                label="t:trustDeed.trustAddress"
                placeholder="t:trustDeed.placeholders.trustAddress"
                type="textarea"
                required
              />
              
              <TranslatedFormField
                name="amount"
                label="t:trustDeed.amountInNumbers"
                placeholder="t:trustDeed.placeholders.amountNumbers"
                type="number"
                required
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {t('trustDeed.trustees')}
              </h2>
              
              <TranslatedFormField
                name="trusteeName"
                label="t:trustDeed.name"
                placeholder="t:trustDeed.placeholders.name"
                required
              />
              
              <TranslatedFormField
                name="trusteeRelation"
                label="t:trustDeed.relation"
                placeholder="t:trustDeed.placeholders.relation"
                required
              />
              
              <TranslatedFormField
                name="trusteeMobile"
                label="t:trustDeed.mobile"
                placeholder="t:trustDeed.placeholders.mobile"
                type="tel"
                required
              />
              
              <TranslatedFormField
                name="idType"
                label="t:trustDeed.idType"
                type="select"
                required
              >
                <option value="">{t('common.select')}</option>
                <option value="aadhar">{t('idTypes.aadhar')}</option>
                <option value="pan">{t('idTypes.pan')}</option>
                <option value="voter">{t('idTypes.voter')}</option>
                <option value="passport">{t('idTypes.passport')}</option>
                <option value="driving">{t('idTypes.driving')}</option>
                <option value="other">{t('idTypes.other')}</option>
              </TranslatedFormField>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
              {t('buttons.saveDraft')}
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
              {t('buttons.preview')}
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
              {t('buttons.submit')}
            </button>
          </div>

          {/* Language Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {t('common.info')}
            </h3>
            <p className="text-blue-700">
              {t('common.language')}: <strong>{t('common.language')}</strong> | 
              Current: <strong>{t('common.language')}</strong>
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Switch languages using the dropdown above to see all form elements update dynamically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageDemo;
