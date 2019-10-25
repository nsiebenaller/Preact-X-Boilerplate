import { h } from 'preact';
import Menu from './Menu.js';
import ImageRow from './ImageRow.js';
import style from './Header.less';


export default function Header({ options, setIsLoading }) {
	return(
		<header class={style['global-app-header']}>
			<div class={style['global-app-header-container']}>
				<ImageRow />
				<ul class={style['link-block']}>
					<li><a href="/eBRAP/public/index.htm">Home</a></li>
					<li><a href="/eBRAP/public/Helpdesk.htm">Help Desk</a></li>
					<li><a href="/eBRAP/public/UserGuide.pdf">Guide</a></li>
					<li><a href="/eBRAP/public/FAQ.htm">FAQ</a></li>
					<li><a href="http://cdmrp.army.mil/aboutus">About Us</a></li>
					<li><a href="/eBRAP/public/SiteMap.htm">Site Map</a></li>
					<li><a href="/eBRAP/public/privacyStatement.html">Privacy Statement</a></li>
					<li><a href="/eBRAP/public/externalLinksDisclaimer.htm">External Links Disclaimer</a></li>
					<li><a href="/eBRAP/j_spring_security_logout">Logout</a></li>
				</ul>
				<div class={style['global-app-title-container']}>
					<div class={style['global-app-header-title']}>Electronic Biomedical Research Application Portal</div>
					<div>Serving DoD, DHA, US Army, USAMRMC, USAMRAA, CDMRP</div>
				</div>
			</div>
			<div class={style['session-timeout']}>
				Your eBRAP session will expire after 4 hrs of inactivity
			</div>
			<Menu
				options={options}
				setIsLoading={setIsLoading}
			/>
		</header>
	)
}
