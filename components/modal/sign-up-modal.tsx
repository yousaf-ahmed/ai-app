import React from 'react';
import { useUsage } from '@/context/usage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import Link from 'next/link';

export default function SignUpModal() {
  const { openModal, setOpenModal } = useUsage();

  return (
    <Dialog open={openModal} onOpenChange={() => openModal ? setOpenModal(!openModal) : setOpenModal(openModal)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlock unlimited AI-powered Content</DialogTitle>
          <DialogDescription ref={null} className="text-sm text-muted-foreground">
  <span id="radix-:Rkrql7H2:" className="text-sm text-muted-foreground" ref={null}>
Upgrade your plan from here 
  </span>
  <span>
    <span>
        Upgrade it to unlock Unlimited Words
    </span>
  </span>
  <Button>
    <Link href="/membership">Join MemberShip</Link>
  </Button>
</DialogDescription>

        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
