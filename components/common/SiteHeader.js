import React, { useState } from "react";
import Link from "next/link";
import head from "next/head";

const SiteHeader = ({ globalData, sitemapNode, page }) => {
  // get header data
  const { header } = globalData;

  // open / close mobile nav
  const [open, setOpen] = useState(false);


  if (!header) {
    return (
      <header className="relative p-8 text-center">
        <p className="text-gray-400 font-bold">No Header Available</p>
      </header>
    );
  }

  return (
    <header className="relative w-full mx-auto bg-white px-8"> </header>
  );
};

SiteHeader.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  // set up api
  const api = agility;

  // set up content item
  let contentItem = null;

  // set up links
  let links = [];

  try {
    // try to fetch our site header
    let header = await api.getContentList({
      referenceName: "siteheader",
      languageCode: languageCode,
	  take: 1
    });

    // if we have a header, set as content item
    if (header && header.items && header.items.length > 0) {
      contentItem = header.items[0];

      // else return null
    } else {
      return null;
    }
  } catch (error) {
    if (console) console.error("Could not load site header item.", error);
    return null;
  }

  try {
    // get the nested sitemap
    let sitemap = await api.getSitemapNested({
      channelName: channelName,
      languageCode: languageCode,
    });

    // grab the top level links that are visible on menu
    links = sitemap
      .filter((node) => node.visible.menu)
      .map((node) => {
        return {
          title: node.menuText || node.title,
          path: node.path,
        };
      });
  } catch (error) {
    if (console) console.error("Could not load nested sitemap.", error);
  }

  // return clean object...
  return {
    siteName: contentItem.fields.siteName,
    logo: contentItem.fields.logo,
    links,
  };
};

export default SiteHeader;
