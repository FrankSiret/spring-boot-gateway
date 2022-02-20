import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Button, Modal, Alert, Form, Input, Checkbox } from 'antd';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: (username: string, password: string, rememberMe: boolean) => void;
  handleClose: () => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const login = ({ username, password, rememberMe }) => {
    props.handleLogin(username, password, rememberMe);
  };

  const { loginError, handleClose } = props;

  const [formLogin] = Form.useForm();

  const loginClick = () => {
    formLogin.submit();
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
          <Alert type="error" data-cy="loginError">
            <Translate contentKey="login.messages.error.authentication">
              <strong>Failed to sign in!</strong> Please check your credentials and try again.
            </Translate>
          </Alert>
        ) : null}
        <Form onFinish={login} initialValues={{ rememberMe: true }} form={formLogin} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            name="username"
            label={translate('global.form.username.label')}
            // data-cy="username"
            rules={[{ required: true, message: translate('login.required.username') }]} // 'Please input your username!'
          >
            <Input data-cy="username" autoFocus placeholder={translate('global.form.username.placeholder')} />
          </Form.Item>
          <Form.Item
            name="password"
            label={translate('login.form.password')}
            // data-cy="password"
            rules={[{ required: true, message: translate('login.required.password') }]} // 'Please input your password!'
          >
            <Input data-cy="password" placeholder={translate('login.form.password.placeholder')} />
          </Form.Item>
          <Form.Item name="rememberMe" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>
              <Translate contentKey="login.form.rememberme">Remember me</Translate>
            </Checkbox>
          </Form.Item>
        </Form>
      </>
    </Modal>
  );
};

export default LoginModal;
