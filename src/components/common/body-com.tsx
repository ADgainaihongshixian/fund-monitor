import { ReactNode, useMemo, useState } from "react"
import { Box } from "@mui/material"
import Navbar from "@components/navbar";

interface BodyComProps {
    children?: ReactNode | string | number | null;
    otherChildren?: ReactNode | string | number | null;
    footer?: ReactNode | string | number | null;
};

const BodyCom = (props: BodyComProps) => {
    const { children = null, otherChildren = null, footer = null } = props;
    const [navbarHeight, setNavbarHeight] = useState(0);
    console.log('##navbarHeight', navbarHeight);


    return (
        <Box className='min-h-screen bg-gray-50'>
            <Navbar setNavbarHeight={setNavbarHeight} />
            {!!children && <main style={{ '--header-height': `${navbarHeight}px` } as React.CSSProperties} className="py-4 overflow-y-auto h-[calc(100vh-var(--header-height))]">{children}</main>}
            {otherChildren}
            {footer}
        </Box>
    )
};

export default BodyCom;
