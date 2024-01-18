import {CBadge, CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CContainer, CFormRange, CFormSwitch,CRow} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import './App.css'
import { useEffect, useState } from 'react'
import React from 'react';
import axios from 'axios'
import  CIcon  from '@coreui/icons-react';
import { cilSync } from '@coreui/icons';


const App = () => {

	useEffect(() =>{
		
  	}, []);

  	return ( <>
		<CContainer fluid style={{backgroundColor : '#D3D3D3'}}>
			<CRow>
				<h1 className='heading'>Smart Bridge Dashboard</h1>
			</CRow>
			<CRow>
				<CCol>
					<CCard className='current-status'>
						<CCardHeader>
							<h2>Water Level Subsystem</h2>
						</CCardHeader>
						<CCardBody>
							<p><b>Status: </b></p>
							<p><b>Valve: </b></p>
							<p><b>Red Led: </b></p>
							<p><b>Green Led: </b></p>
							<p><b>Water Distance: </b></p>
							<p><b>Manual Status: </b></p>
						</CCardBody>
					</CCard>
				</CCol>
				<CCol>
					<CCard className='current-status'>
						<CCardHeader>
							<h2>Smart Light Subsystem</h2>
						</CCardHeader>
						<CCardBody>
							<p><b>Status: </b></p>
							<p><b>Dark: </b></p>
							<p><b>Detected: </b></p>
							<p><b>Smart Light: </b></p>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>
			<CRow>
			<CCol>
				<CCard className='manage-status'>
					<CCardHeader><h2>Manage Mode</h2></CCardHeader>
					<CCardBody>
						<CFormRange
        					label={'Roller Blind Level\t' + "add_value" +'%'}
        					min={0}
        					max={180}
        					step={1}
							value={"add_value"}
							/*onChange={(event) => function(event.target.value)}*/
    					></CFormRange>
						<CFormSwitch
							size='lg'
							label='Manual'
							defaultValue={false}
							/*onClick={(event) => function(event.target.checked)}*/
      					></CFormSwitch>
					</CCardBody>
				</CCard>
			</CCol>
			</CRow>
		</CContainer>
		</>
  	);
}

export default App;
