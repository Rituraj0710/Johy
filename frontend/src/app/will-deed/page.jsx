"use client";
import { useEffect } from "react";
import "./willdeed.css";
import "./willdeed.js";

export default function WillDeed() {
  useEffect(() => {
    window.initWillDeed();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">अंतिम वसीयतनामा (Will Deed) — Generator</div>
          <div className="small">Preview में legal Hindi draft बनेगा — allocation mapping, rules, conditions और watermark included.</div>
        </div>
        <div className="controls">
          <button className="btn save" onClick={() => window.saveDraft()}>💾 Save Draft</button>
          <button className="btn preview" onClick={() => window.generatePreview()}>🔍 Preview</button>
          <button className="btn submit" onClick={() => window.submitForm()}>✅ Submit</button>
        </div>
      </div>

      <div id="formCard" className="card">
        <div className="section" id="testatorSection">
          <h2>1) वसीयतकर्ता (Testator)</h2>
          <div className="person-grid">
            <div className="row-1">
              <div>
                <label>नाम</label>
                <div className="name-group">
                  <select id="testatorPrefix"><option>श्री</option><option>श्रीमती</option><option>कुमारी</option><option>अन्य</option></select>
                  <input type="text" id="testatorName" placeholder="पूरा नाम" />
                </div>
              </div>
              <div>
                <label>श्री पिता/पति का नाम</label>
                <input type="text" id="testatorFH" placeholder="पिता/पति का नाम" />
              </div>
              <div>
                <label>मोबाइल नंबर</label>
                <input type="tel" id="testatorMobile" placeholder="10 अंक" />
              </div>
              <div>
                <label>पता</label>
                <textarea id="testatorAddress"></textarea>
              </div>
            </div>
            <div className="row-2">
              <div>
                <label>Identity Type</label>
                <select id="testatorIdType"><option>आधार कार्ड</option><option>पैन कार्ड</option><option>वोटर आईडी</option><option>पासपोर्ट</option><option>ड्राइविंग लाइसेंस</option><option>अन्य</option></select>
              </div>
              <div>
                <label>Identity No.</label>
                <input type="text" id="testatorIdNo" />
              </div>
              <div>
                <label>Identity Upload</label>
                <input type="file" id="testatorIdUpload" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <div>
                <label>Passport Photo</label>
                <div className="file-row">
                  <input type="file" id="testatorPhoto" accept="image/*" onChange={(e)=>window.previewImage(e.target,'testatorPreview')} />
                  <img id="testatorPreview" className="avatar" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>2) लाभार्थी (Beneficiaries)</h2>
          <div id="beneficiaries"></div>
          <button className="btn add-btn" onClick={() => window.addBeneficiary()}>+ लाभार्थी जोड़ें</button>
        </div>

        <div className="section">
          <h2>3) निष्पादक (Executors)</h2>
          <div id="executors"></div>
          <button className="btn add-btn" onClick={() => window.addExecutor()}>+ निष्पादक जोड़ें</button>
        </div>

        <div className="section">
          <h2>4) गवाह (Witnesses)</h2>
          <div id="witnesses"></div>
          <button className="btn add-btn" onClick={() => window.addWitness()}>+ गवाह जोड़ें</button>
        </div>

        <div className="section">
          <h2>5) संपत्ति विवरण (Property Details)</h2>
          <label>संपत्ति का प्रकार चुनें</label>
          <div className="input-inline">
            <select id="propertyType" onChange={()=>onPropertyTypeChange()}>
              <option value="">-- चुनें --</option>
              <option value="immovable">अचल संपत्ति</option>
              <option value="movable">चल संपत्ति</option>
              <option value="both">दोनों</option>
            </select>
          </div>

          <div id="immovableArea" style={{display:'none',marginTop:10}}>
            <h3>अचल संपत्ति (Immovable)</h3>
            <div id="immovableList"></div>
            <button className="btn add-btn" onClick={() => window.addImmovable()}>+ अचल संपत्ति जोड़ें</button>
          </div>

          <div id="movableArea" style={{display:'none',marginTop:10}}>
            <h3>चल संपत्ति (Movable)</h3>
            <div id="movableList"></div>
            <button className="btn add-btn" onClick={() => window.addMovable()}>+ चल संपत्ति जोड़ें</button>
          </div>
        </div>

        <div className="section rules">
          <h2>6) नियम एवं घोषणाएँ (Rules & Regulations)</h2>
          <label><input type="checkbox" id="selectAllRules" onChange={(e)=>window.toggleAllRules(e.target)} /> Select All</label>
          <div id="rulesList" style={{marginTop:8}}></div>
          <div style={{marginTop:8}}>
            <button className="btn" onClick={() => window.addCustomRule()}>+ Add More Rule</button>
          </div>
          <hr style={{margin:"12px 0"}} />
          <label><input type="checkbox" id="enableConditions" onChange={(e)=>window.toggleConditions(e.target)} /> Add Conditions</label>
          <div id="conditionsArea" style={{display:'none',marginTop:8}}>
            <div id="conditionsList"></div>
            <button className="btn" onClick={() => window.addCondition()}>+ Add Condition</button>
          </div>
        </div>

        <div className="section">
          <h3>7) Draft By</h3>
          <label>Prepared By:
            <select id="draftBy">
              <option>Jyoh Services Pvt. Ltd.</option>
              <option>Self</option>
              <option>Other Advocate</option>
            </select>
          </label>
          <div className="small">यह ड्राफ्टर नाम ड्राफ्ट में दिखाई देगा।</div>
        </div>

        <div className="small notice">नोट: फोटो/ID अपलोड केवल preview/metadata हेतु — सर्वर पर भेजने के लिए backend आवश्यक है।</div>
      </div>

      <div id="previewWrap" className="preview-wrap">
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginBottom:8}}>
          <button className="btn" onClick={()=>{document.getElementById('previewWrap').style.display='none'; document.getElementById('formCard').style.display='block';}}>✏️ Edit</button>
          <button className="btn save" onClick={() => window.saveDraft()}>💾 Save</button>
          <button className="btn" onClick={()=>window.print()}>🖨️ Print</button>
        </div>
        <div className="preview-page">
          <div className="watermark-layer" id="wmLayer"></div>
          <div className="preview-body" id="previewBody"></div>
        </div>
      </div>
    </div>
  );
}

function onPropertyTypeChange(){
  const val = document.getElementById('propertyType').value;
  document.getElementById('immovableArea').style.display = (val==='immovable' || val==='both') ? 'block' : 'none';
  document.getElementById('movableArea').style.display = (val==='movable' || val==='both') ? 'block' : 'none';
}
