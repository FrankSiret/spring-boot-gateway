import React from 'react';
import { translate } from 'react-jhipster';
import { Button, Result } from 'antd';
import { useHistory } from 'react-router-dom';

const PageNotFound = () => {
  const history = useHistory();

  const backClick = () => {
    history.push('/');
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle={translate('global.404')}
      extra={
        <Button type="primary" onClick={backClick}>
          Back Home
        </Button>
      }
    />
  );
};

export default PageNotFound;
