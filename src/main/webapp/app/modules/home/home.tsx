import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Row, Col, Alert, Divider } from 'antd';

import { useAppSelector } from 'app/config/store';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <div className="app-page">
      <Row className="site-layout-content">
        <Col md="24">
          <h2>
            <Translate contentKey="home.title">Welcome to Gateway&apos;s Management</Translate>
          </h2>
          <p className="lead">
            <Translate contentKey="home.subtitle">
              A simple project of REST API with <span>Spring Boot</span>, <span>MySQL</span> and <span>ReactJS</span>.
            </Translate>
          </p>
          {account?.login ? (
            <div>
              <Alert
                type="success"
                message={
                  <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                    You are logged in as user {account.login}.
                  </Translate>
                }
              />
            </div>
          ) : (
            <div>
              <Alert
                type="warning"
                message={
                  <>
                    <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
                    <Link to="/login" className="alert-link">
                      <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
                    </Link>
                    <Translate contentKey="global.messages.info.authenticated.suffix">
                      , you can try the default accounts:
                      <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                      <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
                    </Translate>
                  </>
                }
              />
            </div>
          )}

          <Divider />

          <h2>API</h2>
          <p>
            <Translate contentKey="home.messages.api">You can check the API Documentation </Translate>
            <Link to="/admin/docs" rel="noreferrer" target="_blank">
              <Translate contentKey="home.messages.here">here </Translate>
            </Link>
            <Translate contentKey="home.messages.swagger">provided by </Translate>{' '}
            <a href="https://swagger.io/" rel="noreferrer" target="_blank">
              @Swagger
            </a>
          </p>

          <h2>
            <Translate contentKey="home.messages.contact">Contact</Translate>
          </h2>
          <p>Frank Rodríguez Siret</p>
          <ul>
            <li>
              <Translate contentKey="home.messages.contact.email">Email: </Translate>
              frank.siret@gmail.com
            </li>
            <li>
              Linkedin:{' '}
              <a href="https://www.linkedin.com/in/frank-siret" rel="noreferrer" target="_blank">
                Frank Rodríguez Siret
              </a>
            </li>
            <li>
              <Translate contentKey="home.messages.contact.website">Website: </Translate>
              <a href="https://franksiret.github.io/resume-cv" rel="noreferrer" target="_blank">
                <Translate contentKey="home.messages.contact.resume">Resume CV</Translate>
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
