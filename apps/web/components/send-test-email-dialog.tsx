'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { sendTestEmail } from '@/app/actions/send-test-email';
import { useEditor } from '@/hooks/use-editor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { track } from '@/lib/track';

export function SendTestEmailDialog() {
  const { editorMode, html, reactEmailCode } = useEditor();
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Test Email');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const content = editorMode === 'html' ? html : reactEmailCode;

    setIsSending(true);

    const result = await sendTestEmail(email, subject, content, editorMode);

    setIsSending(false);

    if (result.success) {
      track('send_test_email_sent', { editor_mode: editorMode });
      toast.success('Test email sent successfully!');
      setEmail('');
      setSubject('Test Email');
    } else {
      track('send_test_email_failed', { error: result.error });
      toast.error(result.error);
    }
  };

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (open) track('send_test_email_opened');
      }}
    >
      <AlertDialogTrigger
        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-none')}
      >
        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Send Test
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Send Test Email</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Send the email to test how it looks in a real inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-zinc-300">
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
          </div>

          <AlertDialogFooter className="mt-6 border-zinc-800 bg-zinc-800/50">
            <AlertDialogCancel
              onClick={() => track('send_test_email_cancelled')}
              className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              render={
                <Button type="submit" disabled={isSending || !email || !subject}>
                  {isSending ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Send Test
                    </>
                  )}
                </Button>
              }
            />
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
