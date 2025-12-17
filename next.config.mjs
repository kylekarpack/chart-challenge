import createMDX from "@next/mdx";

const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/charts",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
