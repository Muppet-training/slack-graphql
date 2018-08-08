import React from 'react';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';

const ViewTeam = ({ match: { params } }) => (
	<AppLayout>
		<Sidebar currentTeamId={params.team_id} />
		<Header channelName="General" />
		<Messages>
			<ul className="message-list">
				<li />
				<li />
			</ul>
		</Messages>
		<SendMessage channelName="General" />
	</AppLayout>
);

export default ViewTeam;
