'use client'
import React, { FC, useState } from 'react'
import Heading from '../utils/Heading'
import Header from '../components/Header';
import Profile from '../components/Profile/Profile';
import { useSelector } from "react-redux";

type Props = {}

const page: FC = (props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(5);
    const [route, setRoute] = useState("Login");
    const { user } = useSelector((state: any) => state.auth);
    return (
        <div>
            <Heading
                title={`${user?.name}'s Profile`}
                description="SolviT is a platform for students"
                keywords="Wbjee,Neet,GATE"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setRoute={setRoute}
                route={route}
            />
            <Profile user={user} />
        </div>
    )
}

export default page