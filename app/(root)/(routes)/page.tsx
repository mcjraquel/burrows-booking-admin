"use client";

import { useEffect } from "react";

import { useAddBranchModal } from "@/hooks/use-add-branch-modal";
// import { Button } from "@/components/ui/button";
// import NavBar from "@/components/navbar";

const SetupPage = () => {
    const onOpen = useAddBranchModal((state) => state.onOpen);
    const isOpen = useAddBranchModal((state) => state.isOpen);

    useEffect(() => {
        if (!isOpen) {
            onOpen();
        }
    }, [isOpen, onOpen]);

    // return (
    //   <div className="">
    //     <h1>Admin Dashboard</h1>
    //     <UserButton afterSignOutUrl="/" />
    //     <Button variant="outline">Button</Button>
    //     <NavBar />
    //   </div>
    // );

    return null;
};

// export default function Home() {
//   return (
//     <div className="">
//       <h1>Admin Dashboard</h1>
//       <Button variant="outline">Button</Button>
//       <NavBar />
//     </div>
//   );
// }

export default SetupPage;
