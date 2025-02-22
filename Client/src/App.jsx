import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Welcome from './Components/Welcome';
import "antd/dist/reset.css";  // Newer Ant Design (v5) CSS reset
import { GameComponent } from './Components/VirtualOffice';
import GoogleLoginCard from './Components/GoogleLogin';




function App() {
 

  return (
    <>
    
      <Router>
        <Routes>
          <Route path = "/" element = {<Welcome/>}>
          </Route>
          <Route path='/VirtualOffice' element = {<GameComponent/>}/>
          <Route path='/Sign-in' element = {<GoogleLoginCard/>}/>
        </Routes>
      </Router>
      
    </>
  )
}

export default App
