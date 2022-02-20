import './docs.scss';

import React from 'react';

const DocsPage = () => (
  <div className="app-page w-100">
    <div className="site-layout-content">
      <iframe
        src="../swagger-ui/index.html"
        width="100%"
        height="800"
        title="Swagger UI"
        seamless
        style={{ border: 'none' }}
        data-cy="swagger-frame"
        className="api-docs"
      />
    </div>
  </div>
);

export default DocsPage;
