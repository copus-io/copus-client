/** @type {import('tailwindcss').Config} */
import { baseWidth } from './src/assets/css/theme';

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        // 比例颜色
        ratio: 'rgba(var(--btn-save), 0.9)',
        // 成功
        success: 'rgba(var(--btn-save), <alpha-value>)',
        // error
        error: 'rgba(var(--text-error), <alpha-value>)', // 228, 26, 26; #e41a1a
        // 警用
        disabled: 'rgba(0, 0, 0, 0.25)',
        // 禁用背景
        'disabled-bg': 'rgba(0, 0, 0, 0.15)',
        // 边框颜色
        border: 'rgba(var(--text-second), 0.6)',
        borderWhite: 'rgba(var(--border), 1)',
        borderThirdColor: 'rgba(var(--bg-second), 0.6)',
        'border-second': 'rgba(var(--text-second), 0.2)',
        'border-fouth': 'rgba(var(--btn-ratio), <alpha-value>)',
        'border-modelbg': 'rgba(var(--bg-modelbg), <alpha-value>)',
        border4: 'rgba(var(--border4), <alpha-value>)',

        // 一级文字 主文本色
        white: 'rgba(var(--bg-base), <alpha-value>)', // 255, 255, 255; #fff
        first: 'rgba(var(--text-first), <alpha-value>)', // 35, 31, 32; rgba(var(--text-first), 1)
        second: 'rgba(var(--text-second), <alpha-value>)', // 136, 136, 136; #888888
        secondV2: 'rgba(var(--text-second-v2), <alpha-value>)', // 136, 136, 136; #888888
        black: 'rgba(var(--bg-base1), <alpha-value>)', // 255, 255, 255; #fff

        third: 'rgba(var(--text-third), <alpha-value>)', // 94, 94, 94; #5e5e5e
        fourth: 'rgba(var(--text-fourth), <alpha-value>)', // 131, 59, 59; #833b3b
        five: 'rgba(var(--text-five), <alpha-value>)', // 255, 64, 26; #ff401a
        sixth: 'rgba(var(--text-sixth), <alpha-value>)', // 234, 66, 37; #ea4225
        seventh: 'rgba(var(--text-seventh), <alpha-value>)', // 220, 158, 61; #dc9e3d
        eighth: 'rgba(var(--text-eighth), <alpha-value>)', // 128, 66, 242; #8042f2
        ninth: 'rgba(var(--text-ninth), <alpha-value>)', // 202, 183, 31; #cab71f
        tenth: 'rgba(var(--text-tenth), <alpha-value>)', // 83,79,79; #53504f
        eleventh: 'rgba(var(--text-eleventh), <alpha-value>)', // 165, 109, 25; #a56d19
        twelfth: 'rgba(var(--text-twelfth), <alpha-value>)', // 147, 90, 138; #935a8a

        // 按钮
        'btn-writing': 'rgba(var(--btn-writing), <alpha-value>)', // 212, 201, 253; #d4c9fd
        'btn-writing-checked':
          'rgba(var(--btn-writing-checked), <alpha-value>)', // 133, 120, 180; #8578b4
        'btn-login': 'rgba(var(--btn-login), <alpha-value>)', // 186, 249, 193; #baf9c1
        'btn-join': 'rgba(var(--btn-join), <alpha-value>)', //240 231 6; #f0e706
        'btn-join-checked': 'rgba(var(--btn-join-checked), <alpha-value>)', //249,242,186; #f9f2ba
        'btn-dive': 'rgba(var(--btn-dive), <alpha-value>)', // 241, 241, 241; #d9d9d9

        'btn-save': 'rgba(var(--btn-save), <alpha-value>)', //37, 190, 34; #25be22
        'btn-ratio': 'rgba(var(--btn-ratio), <alpha-value>)', //90, 140, 147; #5a8c93
        'btn-pink': 'rgba(var(--btn-pink), <alpha-value>)', //255, 207, 207; #ffcfcf
        // 背景
        'bg-first': 'rgba(var(--bg-first), <alpha-value>)', // 217, 217, 217; #d9d9d9
        'bg-second': 'rgba(var(--bg-second), <alpha-value>)', //  221, 221, 221; #dddddd
        'bg-third': 'rgba(var(--bg-third), <alpha-value>)', //  209, 209, 209; #d1d1d1
        'bg-fouth': 'rgba(var(--bg-fourth), <alpha-value>)', // 132, 206, 156; #84ce9c
        'bg-five': 'rgba(var(--bg-five), <alpha-value>)', // 54, 122, 179; #367ab3
        'bg-sixth': 'rgba(var(--bg-sixth), <alpha-value>)', // 67, 67, 67; #434343
        'bg-seventh': 'rgba(var(--bg-seventh), <alpha-value>)', // 207, 207, 207; #cfcfcf
        'bg-twelfth': 'rgba(var(--bg-twelfth), <alpha-value>)', // 228, 224, 224; #e4e0e0
        'bg-modelbg': 'rgba(var(--bg-modelbg), <alpha-value>)', // rgba(57, 57, 57, 1); ##393939
        'bg-message': 'rgba(var(--bg-message), <alpha-value>)', //rgba(228, 224, 224, 1) #E4E0E0

        // shadow
        'shadow-base': 'rgba(var(--shadow-base), <alpha-value>)', //  0, 0, 0; #000000
        'shadow-sencond': 'rgba(var(--shadow-sencond), <alpha-value>)', //  173, 173, 173; #adadad
      },
      width: {
        'base-width': baseWidth,
      },
      screens: {
        lg: baseWidth,
      },
      borderRadius: {
        /**
         * 0px
         */
        0: '0',
        /**
         * 4px
         */
        xxs: '4px',
        /**
         * 8px
         */
        xs: '8px',
        /**
         * 12px
         */
        sm: '12px',
        /**
         * 16px
         */
        md: '16px',
        /**
         * 24px
         */
        lg: '24px',
      },
      boxShadow: {
        DEFAULT: '2px 2px 6px rgba(var(--shadow-base), 0.25)',
        hover: '1px 1px 8px rgba(var(--text-second), 0.6)',
        'shadow-second': '0 1px 6px 0 rgba(var(--shadow-second), 0.25)',
        'second-hover': '0 1px 6px 0 rgba(var(--shadow-second), 0.6)',
        custom: '3px 3px 2px 0 var(--tw-shadow-color)',
        'custom-hover': '2px 2px 2px 0 var(--tw-shadow-color)',
      },
      // font-family: Maven Pro, Julius Sans One, Inter !important;
      fontFamily: {
        julius: 'Julius Sans One',
        inter: 'Inter',
        maven: 'Maven Pro',
      },
    },
  },

  corePlugins: {
    preflight: false,
  },
};
