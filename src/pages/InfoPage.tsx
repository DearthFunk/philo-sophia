import React from 'react';
import { useAppContext } from '../context/AppContext';

import './SettingsPage.css'; // Reuse the same styles as settings
import './InfoPage.css';

const InfoPage: React.FC = () => {
  const { customizeEnabled } = useAppContext();
  return (
    <div className={`settings-page ${!customizeEnabled ? 'customize-disabled' : ''}`}>
      <div className="content">
        <div className="section">
          <div className="title">Info / Tips</div>
          <div className="item">
            <p className="info">
              ⦿ To limit API requests responses are cached; right-click any integration button (📖 🌐 📝 📘) to clear cache for that specific term or clear the entire cache from the settings page.
            </p>
            <p className="info">
              ⦿ Focusing on the input box causes the results page to load.
            </p>
            <p className="info">
              ⦿ Customizations are available through the settings page. Once on, your changes are stored in local storage. Flipping customize back off does not erase those selections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
