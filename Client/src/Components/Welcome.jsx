import React, { useState } from 'react';

import { Breadcrumb, Layout, Menu, theme } from 'antd';
import DynamicTitle from './DynamicTitle';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const items1 = [
  { key: 'home', label: 'Home' },
  { key: 'login', label: 'Sign in' },
  { key: 'account', label: 'My Account' },
];

const subOptionRoutes = {
  'Office1': '/VirtualOffice',
  'Office-2': '/office2',
  'Home-1': '/home1',
  'Home-2': '/home2',
  // Add more mappings as needed
};

  const handleSubMenuClick = (e) => {
    const route = subOptionRoutes[e.key]; // Get the route from the mapping object
    if (route) {
      navigate(route); // Navigate to the corresponding route
    }
  };

const items2 = ['Office', 'Home'].map((index, i) => {
  return {
    key: `${index}`, // Unique key for the parent menu item
    label: `${index}`,
    children: new Array(2).fill(null).map((_, j) => {
      const subKey = `${index}-${j + 1}`; // Unique key for each sub-option
      return {
        key: subKey, // Use the unique key
        label: `${index} ${j + 1}`,
        onClick: handleSubMenuClick, // Add onClick handler for sub-options
      };
    }),
  };
});

const Welcome = () => {
  const navigate = useNavigate();
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'home':
        navigate('/'); // Navigate to the home page
        break;
      case 'login':
        navigate('/Sign-in') // Navigate to the login page
        break;
      case 'account':
        // Navigate to the account page (you can add this route later)
        break;
      default:
        break;
    }
  };

  

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          onClick={handleMenuClick}
          items={items1}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <DynamicTitle/>
            {isLoginVisible && <GoogleLoginCard />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Welcome;