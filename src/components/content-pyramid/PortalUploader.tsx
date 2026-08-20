"use client";

import { Camera, CheckCircle2, FileVideo, Image as ImageIcon, LoaderCircle, Upload, X } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import type { DemoTenant } from "@/lib/content-pyramid/demo-data";

export function PortalUploader({ tenant }: { tenant: DemoTenant }) {
  const [file, setFile] = useState<File | null>(null);
  const [handle, setHandle] = useState("");
  const [caption, setCaption] = useState("");
  const [rightsAgreed, setRightsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fileTypeLabel = useMemo(() => {
    if (!file) return null;
    return file.type.startsWith("video") ? "Video selected" : "Photo selected";
  }, [file]);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setMessage(null);

    if (!nextFile) {
      setFile(null);
      return;
    }

    const validTypes = ["video/mp4", "video/quicktime", "image/jpeg", "image/png"];
    if (!validTypes.includes(nextFile.type)) {
      setMessage("Choose an MP4, MOV, JPG, or PNG file.");
      event.target.value = "";
      return;
    }

    if (nextFile.size > tenant.uploadLimitMb * 1024 * 1024) {
      setMessage(`Please choose a file smaller than ${tenant.uploadLimitMb} MB.`);
      event.target.value = "";
      return;
    }

    setFile(nextFile);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!file) {
      setMessage("Add a photo or video before submitting.");
      return;
    }

    if (!rightsAgreed) {
      setMessage("Please confirm the media-rights agreement to continue.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 850));
    setIsSubmitting(false);
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <section className="rounded-[2rem] bg-white p-6 text-center shadow-[0_24px_70px_rgba(18,45,38,0.14)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d9ff5a] text-[#17382f]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-[#4f665d]">Sent to the queue</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.05em] text-[#17382f]">Your moment is in.</h2>
        <p className="mt-3 text-base leading-6 text-[#586b64]">Thanks for sharing. The {tenant.name} team will review it shortly.</p>
        <button
          type="button"
          onClick={() => {
            setFile(null);
            setCaption("");
            setHandle("");
            setRightsAgreed(false);
            setIsComplete(false);
          }}
          className="mt-6 w-full rounded-2xl border border-[#d7ded9] px-4 py-3 text-sm font-bold text-[#17382f] transition hover:bg-[#f2f5f1]"
        >
          Share another
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="group block cursor-pointer rounded-[1.7rem] border-2 border-dashed border-[#aec2b8] bg-white p-4 transition hover:border-[#17382f] hover:bg-[#fbfffc]">
        <input
          type="file"
          accept="video/mp4,video/quicktime,image/jpeg,image/png"
          capture="environment"
          onChange={onFileChange}
          className="sr-only"
        />
        <div className="flex min-h-48 flex-col items-center justify-center rounded-[1.2rem] bg-[#e8eee9] px-5 text-center">
          {file ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d9ff5a] text-[#17382f]">
                {file.type.startsWith("video") ? <FileVideo className="h-7 w-7" /> : <ImageIcon className="h-7 w-7" />}
              </div>
              <p className="mt-4 max-w-[17rem] truncate text-base font-bold text-[#17382f]">{file.name}</p>
              <p className="mt-1 text-sm text-[#60736a]">{fileTypeLabel} · {(file.size / 1024 / 1024).toFixed(1)} MB</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#17382f]"><X className="h-4 w-4" /> Choose a different file</span>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#17382f] text-white"><Camera className="h-7 w-7" /></div>
              <p className="mt-4 text-lg font-bold text-[#17382f]">Tap to record or upload</p>
              <p className="mt-1 text-sm text-[#60736a]">Video or photo · Up to {tenant.uploadLimitSeconds}s / {tenant.uploadLimitMb}MB</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#17382f] shadow-sm"><Upload className="h-3.5 w-3.5" /> Open camera</span>
            </>
          )}
        </div>
      </label>

      <div>
        <label htmlFor="patron-handle" className="mb-2 block text-sm font-bold text-[#17382f]">Your Instagram / TikTok handle <span className="font-normal text-[#71827a]">(for credit)</span></label>
        <input id="patron-handle" value={handle} onChange={(event) => setHandle(event.target.value)} placeholder="@yourhandle" maxLength={100} className="w-full rounded-xl border border-[#ccd8d1] bg-white px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#91a29a] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/50" />
      </div>

      <div>
        <label htmlFor="patron-caption" className="mb-2 block text-sm font-bold text-[#17382f]">Add a quick caption or story <span className="font-normal text-[#71827a]">(optional)</span></label>
        <textarea id="patron-caption" value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="What made this moment worth sharing?" maxLength={500} rows={3} className="w-full resize-none rounded-xl border border-[#ccd8d1] bg-white px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#91a29a] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/50" />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#edf2ed] p-3">
        <input type="checkbox" checked={rightsAgreed} onChange={(event) => setRightsAgreed(event.target.checked)} className="mt-0.5 h-5 w-5 rounded border-[#9caf9f] accent-[#17382f]" />
        <span className="text-xs leading-5 text-[#53665d]">I grant {tenant.name} full royalty-free rights to feature this media across connected social channels. I can request removal later.</span>
      </label>

      {message && <p role="alert" className="rounded-xl bg-[#fff0ed] px-3 py-2 text-sm font-medium text-[#9d2f1c]">{message}</p>}

      <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d9ff5a] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#17382f] transition hover:bg-[#c7f33f] disabled:cursor-wait disabled:opacity-75">
        {isSubmitting ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Sending to the community feed</> : <>Submit to community feed <Upload className="h-4 w-4" /></>}
      </button>
    </form>
  );
}
