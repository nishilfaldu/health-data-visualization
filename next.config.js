/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // seems like current source code for next does not apply linting to app directory
    // add or remove directories accordingly
    // You will see this message during linting: "Pages directory cannot be found at /workspace/client/pages or /workspace/client/src/pages. If using a custom path, please configure with the `no-html-link-for-pages` rule in your eslint config file."
    dirs: ["./src"],
  },
  reactStrictMode: true,
  transpilePackages: [ "antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table" ],
};

module.exports = nextConfig;
