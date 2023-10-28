import React from 'react'
import { Navigate, useParams } from 'react-router-dom';
import HospitalDoctor from '~/pages/user/Hospital/doctors';
import HospitalInformation from '~/pages/user/Hospital/info';
import HospitalInsurance from '~/pages/user/Hospital/insurance';
import HospitalService from '~/pages/user/Hospital/service';


const ActiveComponent = () => {
    let {id,tab} = useParams();
    if(tab && tab === "service") {
        return <HospitalService/>
    }
    else if (tab && tab === "doctor") {
        return <HospitalDoctor/>
    }
    else if (tab && tab === "insurance") {
        return <HospitalInsurance/>
    }
    else {
        return <HospitalInformation/>
    }
}

export default ActiveComponent;