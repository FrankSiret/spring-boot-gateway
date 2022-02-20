/* eslint-disable no-console */
import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Button, Modal, Alert, Form, Input } from 'antd';
import Password from 'antd/lib/input/Password';

import './login.scss';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: (username: string, password: string, rememberMe: boolean) => void;
  handleClose: () => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const login = ({ username, password }) => {
    props.handleLogin(username, password, true);
  };

  const { loginError, handleClose } = props;

  const [formLogin] = Form.useForm();

  const loginClick = () => {
    formLogin.submit();
  };

  const onKeyPress = e => {
    if (e.key === 'Enter') loginClick();
  };

  return (
    <Modal
      visible={props.showModal}
      title={<Translate contentKey="login.title">Sign in</Translate>}
      onCancel={handleClose}
      footer={[
        <Button onClick={handleClose} key="cancel">
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>,
        <Button type="primary" onClick={loginClick} data-cy="submit" key="login">
          <Translate contentKey="login.form.button">Sign in</Translate>
        </Button>,
      ]}
      // data-cy="loginTitle"
    >
      <>
        {loginError ? (
          <Alert
            type="error"
            data-cy="loginError"
            className="error-authentication"
            message={
              <Translate contentKey="login.messages.error.authentication">
                <strong>Failed to sign in!</strong> Please check your credentials and try again.
              </Translate>
            }
          />
        ) : null}
        <Form onFinish={login} form={formLogin} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete="off">
          <Form.Item
            name="username"
            label={translate('global.form.username.label')}
            // data-cy="username"
            rules={[{ required: true, message: translate('login.required.username') }]}
          >
            <Input data-cy="username" autoFocus placeholder={translate('global.form.username.placeholder')} onKeyPress={onKeyPress} />
          </Form.Item>
          <Form.Item
            name="password"
            label={translate('login.form.password')}
            // data-cy="password"
            rules={[{ required: true, message: translate('login.required.password') }]}
          >
            <Password data-cy="password" placeholder={translate('login.form.password.placeholder')} onKeyPress={onKeyPress} />
          </Form.Item>
        </Form>
      </>
    </Modal>
  );
};

export default LoginModal;
