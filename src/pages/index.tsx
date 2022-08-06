/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import type React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import { ImSpinner9 as LoadingSpinner } from 'react-icons/im';
import { isValidUrl } from '../util/isValidUrl';

const placeholderImage =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png';
const PreviewCard: React.FC<{ data: { [key: string]: string } }> = ({ data }) => {
  return (
    <a href={data.url} target="_blank" rel="noreferrer">
      <div className="card card-compact w-96 bg-base-100 shadow-xl transition-colors hover:bg-gray-700">
        <figure className="h-[250px] w-96 border-b-[1px] border-gray-500 ">
          <img
            src={data.image || placeholderImage}
            alt="Shoes"
            height={250}
            width={384}
            className="object-cover h-full w-full"
          />
        </figure>
        <div className="card-body pt-2 gap-1">
          <span className="text-sm text-gray-400 line-clamp-1">{data.url}</span>
          <h2 className="card-title line-clamp-1">{data.title ?? ''}</h2>
          <p className="text-sm text-gray-300 line-clamp-2">{data.description ?? ''}</p>
        </div>
      </div>
    </a>
  );
};

const Home: NextPage = () => {
  const [url, setUrl] = useState('');

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<{} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url || !isValidUrl(url)) {
      setError('Enter a valid URL');
      return;
    }

    try {
      setError(null);
      setData(null);
      setFetching(true);
      const res = await fetch(`/api/previewDetails?url=${url}`);
      const data = await res.json();
      setFetching(false);
      if (res.status === 200) {
        setUrl('');
        setData(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong. Try Again!');
    }
  };
  return (
    <div className="min-h-screen p-10 flex flex-col">
      <header className="pt-3 cursor-pointer flex gap-3 items-center">
        <img src="/logo.png" alt="Logo" height={35} width={35} />
        <p className="text-gray-300 text-lg">Preview Links</p>
      </header>

      <main className="flex flex-col items-center justify-center flex-1">
        <form
          onSubmit={onSubmit}
          className="flex flex-col sm:flex-row gap-5 w-full items-start justify-center mb-20"
        >
          <input
            type="url"
            required
            autoFocus
            value={url}
            onChange={(e) => {
              e.currentTarget.setCustomValidity('');
              setUrl(e.target.value);
            }}
            placeholder="Type a Url to see its preview."
            className="input w-full sm:max-w-sm"
            onInvalid={(e) => {
              e.currentTarget.setCustomValidity('Enter a valid Url');
            }}
          />
          <button
            disabled={fetching}
            className="btn btn-sm sm:btn-md btn-active btn-primary"
            type="submit"
          >
            Get Preview
          </button>
        </form>
        {fetching && <LoadingSpinner className="w-10 h-10 animate-spin" />}
        {error && !fetching && <div className="text-sm text-red-400">{error}</div>}
        {data && !fetching && <PreviewCard data={data} />}
      </main>
    </div>
  );
};

export default Home;
