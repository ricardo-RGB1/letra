'use client';

import { useState, useEffect } from "react";

import { SettingsModal } from "../modals/settings-modal";
import { CoverImageModal } from "../modals/cover-image-modal";


/**
 * ModalProvider component.
 * 
 * @returns The ModalProvider component.
 */
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []); 

    if (!isMounted) {
        return null;
    } // If the component is not mounted, return null

    return (
        <>
            <SettingsModal />
            <CoverImageModal />
        </>
    )
}