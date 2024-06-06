// 公共
const codeInfoList = [
  {
    code: 0,
    desc: 'System internal error',
  },
  {
    code: 403,
    desc: 'Invalid login token',
  },
  {
    code: 1000,
    desc: 'Invalid namespace for the space',
  },
  {
    code: 1001,
    desc: 'You have not joined this space yet',
  },
  {
    code: 1002,
    desc: 'You are not the admin of this space',
  },
  {
    code: 1003,
    desc: 'Space does not exist',
  },
  {
    code: 1004,
    desc: 'Cannot remove the creator of the space',
  },
  {
    code: 1005,
    desc: 'Cannot modify permissions of the space creator',
  },
  {
    code: 1006,
    desc: 'The subdomain for this space already exists',
  },
  {
    code: 1100,
    desc: 'Request does not exist',
  },
  {
    code: 1101,
    desc: 'Invalid id',
  },
  {
    code: 1102,
    desc: 'Data does not exist in database',
  },
  {
    code: 1103,
    desc: 'Invalid keyword in the request',
  },
  {
    code: 1104,
    desc: 'Invalid WorkUuid',
  },
  {
    code: 1105,
    desc: 'Invalid request data',
  },
  {
    code: 2000,
    desc: 'Invalid verification code',
  },
  {
    code: 2001,
    desc: 'Empty verification code',
  },
  {
    code: 2002,
    desc: 'Invalid verification code type',
  },
  {
    code: 2010,
    desc: 'Invalid email',
  },
  {
    code: 2020,
    desc: 'Invalid username',
  },
  {
    code: 2021,
    desc: 'Username already exists',
  },
  {
    code: 2022,
    desc: 'User does not exist',
  },
  {
    code: 2023,
    desc: 'Username cannot exceed 14 characters',
  },
  {
    code: 2030,
    desc: 'Empty password',
  },
  {
    code: 2040,
    desc: 'Invalid wallet address',
  },
  {
    code: 2041,
    desc: 'Wallet address already exists',
  },
  {
    code: 2042,
    desc: 'Invalid vault wallet address',
  },
  {
    code: 2043,
    desc: 'Wallet address of space creator is invalid',
  },
  {
    code: 2044,
    desc: 'Invalid signature data',
  },
  {
    code: 2045,
    desc: 'Invalid signature message',
  },
  {
    code: 2046,
    desc: 'Invalid login authorization type',
  },
  {
    code: 2047,
    desc: 'Signature message verification failed',
  },
  {
    code: 2048,
    desc: 'Invalid ArConnect public key',
  },
  {
    code: 2051,
    desc: 'Account cannot be empty',
  },
  {
    code: 2052,
    desc: 'Password cannot be empty',
  },
  {
    code: 2053,
    desc: 'Image does not exist',
  },
  {
    code: 2054,
    desc: 'Empty old password',
  },
  {
    code: 2055,
    desc: 'Empty new password',
  },
  {
    code: 2056,
    desc: 'Incorrect old password',
  },
  {
    code: 2057,
    desc: 'Incorrect password',
  },
  {
    code: 2058,
    desc: 'Image file is too large',
  },
  {
    code: 2059,
    desc: 'Image resolution is too high',
  },
  {
    code: 2060,
    desc: 'Invalid namespace',
  },
  {
    code: 2100,
    desc: 'Name field is empty',
  },
  {
    code: 2101,
    desc: 'Content field is empty',
  },
  {
    code: 2102,
    desc: 'Content data is too long',
  },
  {
    code: 2103,
    desc: 'Incorrect work type (10:text, 20:image, 30:audio, 40:video, 50:mixed)',
  },
  {
    code: 2104,
    desc: 'You do not have access permission',
  },
  {
    code: 2105,
    desc: 'Space does not exist',
  },
  {
    code: 2110,
    desc: 'Link field is empty',
  },
  {
    code: 2111,
    desc: 'IconUrl field is empty',
  },
  {
    code: 2112,
    desc: 'Link field is too long',
  },
  {
    code: 2113,
    desc: 'SubTitle field is too long',
  },
  {
    code: 2120,
    desc: 'Tag field is empty',
  },
  {
    code: 2121,
    desc: 'TagColor field is empty',
  },
  {
    code: 2122,
    desc: 'Tag name already exists',
  },
  {
    code: 2130,
    desc: 'Comment does not exist in database',
  },
  {
    code: 2131,
    desc: 'Invalid reward amount',
  },
  {
    code: 2132,
    desc: 'At least title or content must exist',
  },
  {
    code: 2133,
    desc: 'Title field is empty',
  },
  {
    code: 2134,
    desc: 'This is a Web3 space, you need to set your wallet address before publishing',
  },
  {
    code: 2135,
    desc: 'TagSet field is empty',
  },
  {
    code: 2136,
    desc: 'Invalid upstream allocation ratio',
  },
  {
    code: 2137,
    desc: 'Upstream is required',
  },
  {
    code: 2138,
    desc: 'Usage data is too long',
  },
  {
    code: 2139,
    desc: 'Space creator cannot unfollow the space',
  },
  {
    code: 2140,
    desc: 'Profit sharing ratio must be greater than 0 and less than or equal to 1',
  },
  {
    code: 2141,
    desc: 'This work does not exist in the space',
  },
  {
    code: 2142,
    desc: 'Reward amount must be greater than 1',
  },
  {
    code: 2143,
    desc: 'Cannot reward yourself',
  },
  {
    code: 2144,
    desc: 'Insufficient balance',
  },
  {
    code: 2145,
    desc: 'Failed to freeze balance',
  },
  {
    code: 2200,
    desc: 'No available land plots',
  },
  {
    code: 2201,
    desc: 'You are not the owner of the land plot, cannot edit its information',
  },
  {
    code: 2202,
    desc: 'The land plot has been sold, cannot be purchased again',
  },
  {
    code: 2203,
    desc: 'Insufficient water drop balance, please top up',
  },
  {
    code: 2204,
    desc: 'Purchase failed, please retry',
  },
  {
    code: 2205,
    desc: 'Invalid land plot number',
  },
  {
    code: 2206,
    desc: 'Invalid land plot',
  },
  {
    code: 2207,
    desc: 'Data is too long',
  },
];

// Convert the above array into subject 404:'Address request error'
let codeInfo = {};
codeInfoList.forEach((item) => {
  codeInfo[item.code + '_code'] = item.desc;
});
export default codeInfo;
