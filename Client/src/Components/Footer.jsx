import React from 'react';
import { Layout, Typography, Row, Col, Divider } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';

const { Footer } = Layout;
const { Link, Text } = Typography;

const AppFooter = () => {
  return (
    <Footer style={{ background: '#001529', color: '#fff', padding: '40px 0' }}>
      <Row justify="center" gutter={[40, 20]}>
        {/* Quick Links */}
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: '#fff' }}>
            Quick Links
          </Title>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <Link href="/about" style={{ color: '#fff' }}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/features" style={{ color: '#fff' }}>
                Features
              </Link>
            </li>
            <li>
              <Link href="/contact" style={{ color: '#fff' }}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" style={{ color: '#fff' }}>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </Col>

        {/* Social Media */}
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: '#fff' }}>
            Follow Us
          </Title>
          <div>
            <Link
              href="https://facebook.com"
              style={{ color: '#fff', marginRight: 16 }}
            >
              <FacebookOutlined style={{ fontSize: 24 }} />
            </Link>
            <Link
              href="https://twitter.com"
              style={{ color: '#fff', marginRight: 16 }}
            >
              <TwitterOutlined style={{ fontSize: 24 }} />
            </Link>
            <Link
              href="https://instagram.com"
              style={{ color: '#fff', marginRight: 16 }}
            >
              <InstagramOutlined style={{ fontSize: 24 }} />
            </Link>
            <Link
              href="https://linkedin.com"
              style={{ color: '#fff', marginRight: 16 }}
            >
              <LinkedinOutlined style={{ fontSize: 24 }} />
            </Link>
          </div>
        </Col>

        {/* Contact Information */}
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: '#fff' }}>
            Contact Us
          </Title>
          <Text style={{ color: '#fff' }}>
            Email: support@metaverse.com
          </Text>
          <br />
          <Text style={{ color: '#fff' }}>Phone: +1 (123) 456-7890</Text>
          <br />
          <Text style={{ color: '#fff' }}>
            Address: 123 Metaverse St, Virtual City
          </Text>
        </Col>

        {/* Newsletter */}
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: '#fff' }}>
            Newsletter
          </Title>
          <Text style={{ color: '#fff' }}>
            Subscribe to our newsletter for updates.
          </Text>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <Button
            type="primary"
            style={{ marginTop: '10px', width: '100%' }}
          >
            Subscribe
          </Button>
        </Col>
      </Row>

      {/* Divider */}
      <Divider style={{ borderColor: '#fff' }} />

      {/* Copyright */}
      <Row justify="center">
        <Col>
          <Text style={{ color: '#fff' }}>
            © {new Date().getFullYear()} 2-D Metaverse. All rights reserved.
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;