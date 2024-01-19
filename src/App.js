import '@picocss/pico'
import './App.css'
import { useEffect, useState } from 'react'
import React from 'react';


const App = () => {

	const [valveSlider, setValveSlider] = useState(50);

	/**
	 * Water Level Subsystem Features
	 */
	const [wlsStatus, setWlsStatus] = useState("PRE-ALARM");
	const [valve, setValve] = useState(0);
	const [redLed, setRedLed] = useState(false);
	const [redLedBlinking, setRedLedBlinking] = useState(false);
	const [greenLed, setGreenLed] = useState(true);
	const [distance, setDistance] = useState(0.0);
	const [manualStatus, setManualStatus] = useState(false);

	/**
	 * Smart Light Subsystem Features
	 */
	const [slsStatus, setSlsStatus] = useState("SYS_ON");
	const [dark, setDark] = useState(false);
	const [detected, setDetected] = useState(false);
	const [smartLight, setSmartLight] = useState(false);
	const [smartLightWaiting, setSmartLightWaiting] = useState(false);

	useEffect(() =>{

		const wls_sse = new EventSource('http://localhost:8080/api/2/things?ids=org.eclipse.ditto:water-level-subsystem',{withCredentials : true});
		const sls_sse = new EventSource('http://localhost:8080/api/2/things?ids=org.eclipse.ditto:smart-light-subsystem',{withCredentials : true});

		//Listen for incoming message from the server
		wls_sse.onmessage = event => {
			if(event.data !== ''){
				/**
				 * Message from Ditto's EventSource arrive in the following format: 
				 * {"thingId":"ID","features":{"featureID":{"properties":{"propertyName":value}}}}
				 * For the purposes of the project, checks are performed only on the Thing ID and the type of received features to update the correct value. 
				 * In a real-world application, additional checks must be performed
				 */
				let data = JSON.parse(event.data);
				if(data.thingId === 'org.eclipse.ditto:water-level-subsystem'){
					let feature = data.features; 
					if(feature.hasOwnProperty('valve')){
						setValve(feature.valve.properties.angle)
					} else if(feature.hasOwnProperty('water-level-sensor')){
						setDistance(feature['water-level-sensor'].properties.distance)
					} else if(feature.hasOwnProperty('green-led')){
						setGreenLed(feature['green-led'].properties.on)
					} else if(feature.hasOwnProperty('red-led')){
						setRedLed(feature['red-led'].properties.on)
						setRedLedBlinking(feature['red-led'].properties.blinking)
					} else if(feature.hasOwnProperty('status')){
						setWlsStatus(feature.status.properties.status)
					}
				}
			}
		}
		sls_sse.onmessage = event => {
			if(event.data !== ''){
				/**
				 * Message from Ditto's EventSource arrive in the following format: 
				 * {"thingId":"ID","features":{"featureID":{"properties":{"propertyName":value}}}}
				 * For the purposes of the project, checks are performed only on the Thing ID and the type of received features to update the correct value. 
				 * In a real-world application, additional checks must be performed
				 */
				let data = JSON.parse(event.data);
				if(data.thingId === 'org.eclipse.ditto:smart-light-subsystem'){
					let feature = data.features; 
					if(feature.hasOwnProperty('light-sensor')){
						setDark(feature['light-sensor'].properties.dark)
					} else if(feature.hasOwnProperty('motion-sensor')){
						setDetected(feature['motion-sensor'].properties.detected)
					} else if(feature.hasOwnProperty('smart-light')){
						setSmartLight(feature['smart-light'].properties.on)
						setSmartLightWaiting(feature['smart-light'].properties.waiting)
					} else if(feature.hasOwnProperty('status')){
						setSlsStatus(feature.status.properties.status)
					}
				}
			}
		}

		wls_sse.onerror = (error) => {
			console.log(error);
			wls_sse.close();
		}
		sls_sse.onerror = (error) => {
			console.log(error);
			wls_sse.close();
		}

		return () => {
			wls_sse.close();
			sls_sse.close();
		}
  	}, []);

	const updateManualStatus = (value) => {
		setManualStatus(value);
		/**
		 * Aggiungere comunicazione con Ditto
		 */
	}

	const updateValveAngle = (value) => {
		setValveSlider(value);
		setValve(value);
		if(manualStatus === true){
		/**
		 * Aggiungere comunicazione con Ditto
		 */
		}
	}

  	return ( <>
		<main className='container' data-theme='dark'>
			<article>
				<h1 className='header'>Smart Bridge Dashboard</h1>
			</article>
			<div className="grid">
  				<div>
					<article >
						<header><h2>Water Level Subsystem</h2></header>
						<table role='grid'>
							<tbody>
    							<tr>
      								<th scope="row"><strong>Status</strong></th>
      								<td><kbd className={wlsStatus === 'NORMAL' ? 'success' : wlsStatus === 'PRE_ALARM' ? 'warning': 'danger'}>{wlsStatus === 'PRE_ALARM' ? "PRE-ALARM" : wlsStatus}</kbd></td>
    							</tr>
								<tr>
      								<th scope="row"><strong>Valve</strong></th>
      								<td><kbd>{valve}°</kbd></td>
    							</tr>
								<tr>
      								<th scope="row"><strong>Red Led</strong></th>
      								<td>
									  	<kbd className={redLed === true ? 'success' : 'danger'}>{redLed === true ? "ON" : "OFF"}</kbd>
										{
											redLedBlinking === true ? <kbd className='warning blinking'>BLINKING</kbd> : null
										}
									</td>
    							</tr>
								<tr>
      								<th scope="row"><strong>Green Led</strong></th>
      								<td><kbd className={greenLed === true ? 'success' : 'danger'}>{greenLed === true ? "ON" : "OFF"}</kbd></td>
    							</tr>
								<tr>
      								<th scope="row"><strong>Water Distance</strong></th>
      								<td><kbd>{distance}m</kbd></td>
    							</tr>
								<tr>
      								<th scope="row"><strong>Manual Status</strong></th>
      								<td><kbd className={manualStatus === true ? 'success' : 'danger'}>{manualStatus === true ? "ON" : "OFF"}</kbd></td>
    							</tr>
							</tbody>
						</table>
						<footer>
							<label htmlFor="switch"> <strong>Manual Mode</strong>
    							<input type="checkbox" id="switch" name="switch" role="switch" onChange={e => updateManualStatus(e.target.checked)} disabled={wlsStatus === "ALARM" ? false : true}></input>
  							</label>
							{wlsStatus !== "ALARM" ? <small>NOTE: Manual Mode can be activated only during alarm state</small> : null}
							{manualStatus === true ?
								<label htmlFor="range">
  									<input type="range" min={0} max={180} step={5} value={valveSlider} id="range" name="range" onChange={e => updateValveAngle(e.target.value)}></input>
									<small>Valve Angle {valveSlider}°</small>
								</label>
								: null
							}
						</footer>
					</article>
				</div>
  				<div>
					<article>
						<header><h2>Smart Light Subsystem</h2></header>
						<table role='grid'>
							<tbody>
    							<tr>
      								<th scope="row"><strong>Status</strong></th>
      								<td><kbd className={slsStatus === "SYS_ON" ? 'success' : 'danger'}>{slsStatus === "SYS_ON" ? "ON" : "OFF"}</kbd></td>
    							</tr>
								<tr>
      								<th scope="row"><strong>Dark</strong></th>
      								<td><kbd className={dark === true ? 'success' : 'danger'}>{dark === true ? "TRUE" : "FALSE"}</kbd></td>
    							</tr>
								<tr>
      								<th scope="row"><strong>Detected</strong></th>
      								<td><kbd className={detected === true ? 'success' : 'danger'}>{detected === true ? "TRUE" : "FALSE"}</kbd></td>
    							</tr>
								<tr>
      								<th scope="row"><strong>Smart Light</strong></th>
      								<td>
										<kbd className={smartLight === true ? 'success' : 'danger'}>{smartLight === true ? "ON" : "OFF"}</kbd>
										{
											smartLightWaiting === true ? <kbd className='waiting'>WAITING</kbd> : null
										}
									</td>
    							</tr>
							</tbody>
						</table>
				  	</article>
				</div>
			</div>
		</main>
		</>
  	);
}

export default App;
