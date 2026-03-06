import { useState } from "react"
import { Box } from "@mui/material"
import Navbar from "@/components/common/navbar";
import { BodyComProps } from "@/types/common";

/**
 * 页面主体组件
 * 包含导航栏、主要内容区域和可选的页脚
 */
const BodyCom = (props: BodyComProps) => {
    const { children = null, otherChildren = null, footer = null } = props;
    const [navbarHeight, setNavbarHeight] = useState(0);

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