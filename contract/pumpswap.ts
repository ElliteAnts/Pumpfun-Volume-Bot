/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pump_amm.json`.
 */
export type PumpSwap = {
    address: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA";
    metadata: {
      name: "pumpAmm";
      version: "0.1.0";
      spec: "0.1.0";
      description: "Created with Anchor";
    };
    instructions: [
      {
        name: "buy";
        discriminator: [102, 6, 61, 18, 1, 218, 235, 234];
        accounts: [
          {
            name: "pool";
          },
          {
            name: "user";
            writable: true;
            signer: true;
          },
          {
            name: "globalConfig";
          },
          {
            name: "baseMint";
            relations: ["pool"];
          },
          {
            name: "quoteMint";
            relations: ["pool"];
          },
          {
            name: "userBaseTokenAccount";
            writable: true;
          },
          {
            name: "userQuoteTokenAccount";
            writable: true;
          },
          {
            name: "poolBaseTokenAccount";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "poolQuoteTokenAccount";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "protocolFeeRecipient";
          },
          {
            name: "protocolFeeRecipientTokenAccount";
            writable: true;
            pda: {
              seeds: [
                {
                  kind: "account";
                  path: "protocolFeeRecipient";
                },
                {
                  kind: "account";
                  path: "quoteTokenProgram";
                },
                {
                  kind: "account";
                  path: "quoteMint";
                }
              ];
              program: {
                kind: "const";
                value: [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ];
              };
            };
          },
          {
            name: "baseTokenProgram";
          },
          {
            name: "quoteTokenProgram";
          },
          {
            name: "systemProgram";
            address: "11111111111111111111111111111111";
          },
          {
            name: "associatedTokenProgram";
            address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [
          {
            name: "baseAmountOut";
            type: "u64";
          },
          {
            name: "maxQuoteAmountIn";
            type: "u64";
          }
        ];
      },
      {
        name: "createConfig";
        discriminator: [201, 207, 243, 114, 75, 111, 47, 189];
        accounts: [
          {
            name: "admin";
            writable: true;
            signer: true;
            address: "8LWu7QM2dGR1G8nKDHthckea57bkCzXyBTAKPJUBDHo8";
          },
          {
            name: "globalConfig";
            writable: true;
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
                }
              ];
            };
          },
          {
            name: "systemProgram";
            address: "11111111111111111111111111111111";
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [
          {
            name: "lpFeeBasisPoints";
            type: "u64";
          },
          {
            name: "protocolFeeBasisPoints";
            type: "u64";
          },
          {
            name: "protocolFeeRecipients";
            type: {
              array: ["pubkey", 8];
            };
          }
        ];
      },
      {
        name: "createPool";
        discriminator: [233, 146, 209, 142, 207, 104, 64, 188];
        accounts: [
          {
            name: "pool";
            writable: true;
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [112, 111, 111, 108];
                },
                {
                  kind: "arg";
                  path: "index";
                },
                {
                  kind: "account";
                  path: "creator";
                },
                {
                  kind: "account";
                  path: "baseMint";
                },
                {
                  kind: "account";
                  path: "quoteMint";
                }
              ];
            };
          },
          {
            name: "globalConfig";
          },
          {
            name: "creator";
            writable: true;
            signer: true;
          },
          {
            name: "baseMint";
          },
          {
            name: "quoteMint";
          },
          {
            name: "lpMint";
            writable: true;
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [112, 111, 111, 108, 95, 108, 112, 95, 109, 105, 110, 116];
                },
                {
                  kind: "account";
                  path: "pool";
                }
              ];
            };
          },
          {
            name: "userBaseTokenAccount";
            writable: true;
          },
          {
            name: "userQuoteTokenAccount";
            writable: true;
          },
          {
            name: "userPoolTokenAccount";
            writable: true;
            pda: {
              seeds: [
                {
                  kind: "account";
                  path: "creator";
                },
                {
                  kind: "account";
                  path: "token2022Program";
                },
                {
                  kind: "account";
                  path: "lpMint";
                }
              ];
              program: {
                kind: "const";
                value: [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ];
              };
            };
          },
          {
            name: "poolBaseTokenAccount";
            writable: true;
            pda: {
              seeds: [
                {
                  kind: "account";
                  path: "pool";
                },
                {
                  kind: "account";
                  path: "baseTokenProgram";
                },
                {
                  kind: "account";
                  path: "baseMint";
                }
              ];
              program: {
                kind: "const";
                value: [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ];
              };
            };
          },
          {
            name: "poolQuoteTokenAccount";
            writable: true;
            pda: {
              seeds: [
                {
                  kind: "account";
                  path: "pool";
                },
                {
                  kind: "account";
                  path: "quoteTokenProgram";
                },
                {
                  kind: "account";
                  path: "quoteMint";
                }
              ];
              program: {
                kind: "const";
                value: [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ];
              };
            };
          },
          {
            name: "systemProgram";
            address: "11111111111111111111111111111111";
          },
          {
            name: "token2022Program";
            address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
          },
          {
            name: "baseTokenProgram";
          },
          {
            name: "quoteTokenProgram";
          },
          {
            name: "associatedTokenProgram";
            address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [
          {
            name: "index";
            type: "u16";
          },
          {
            name: "baseAmountIn";
            type: "u64";
          },
          {
            name: "quoteAmountIn";
            type: "u64";
          }
        ];
      },
      {
        name: "deposit";
        discriminator: [242, 35, 198, 137, 82, 225, 242, 182];
        accounts: [
          {
            name: "pool";
            writable: true;
          },
          {
            name: "globalConfig";
          },
          {
            name: "user";
            signer: true;
          },
          {
            name: "baseMint";
            relations: ["pool"];
          },
          {
            name: "quoteMint";
            relations: ["pool"];
          },
          {
            name: "lpMint";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "userBaseTokenAccount";
            writable: true;
          },
          {
            name: "userQuoteTokenAccount";
            writable: true;
          },
          {
            name: "userPoolTokenAccount";
            writable: true;
          },
          {
            name: "poolBaseTokenAccount";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "poolQuoteTokenAccount";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "tokenProgram";
            address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
          },
          {
            name: "token2022Program";
            address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [
          {
            name: "lpTokenAmountOut";
            type: "u64";
          },
          {
            name: "maxBaseAmountIn";
            type: "u64";
          },
          {
            name: "maxQuoteAmountIn";
            type: "u64";
          }
        ];
      },
      {
        name: "disable";
        discriminator: [185, 173, 187, 90, 216, 15, 238, 233];
        accounts: [
          {
            name: "admin";
            signer: true;
            relations: ["globalConfig"];
          },
          {
            name: "globalConfig";
            writable: true;
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [
          {
            name: "disableCreatePool";
            type: "bool";
          },
          {
            name: "disableDeposit";
            type: "bool";
          },
          {
            name: "disableWithdraw";
            type: "bool";
          },
          {
            name: "disableBuy";
            type: "bool";
          },
          {
            name: "disableSell";
            type: "bool";
          }
        ];
      },
      {
        name: "extendAccount";
        discriminator: [234, 102, 194, 203, 150, 72, 62, 229];
        accounts: [
          {
            name: "account";
            writable: true;
          },
          {
            name: "user";
            signer: true;
          },
          {
            name: "systemProgram";
            address: "11111111111111111111111111111111";
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [];
      },
      {
        name: "sell";
        discriminator: [51, 230, 133, 164, 1, 127, 131, 173];
        accounts: [
          {
            name: "pool";
          },
          {
            name: "user";
            writable: true;
            signer: true;
          },
          {
            name: "globalConfig";
          },
          {
            name: "baseMint";
            relations: ["pool"];
          },
          {
            name: "quoteMint";
            relations: ["pool"];
          },
          {
            name: "userBaseTokenAccount";
            writable: true;
          },
          {
            name: "userQuoteTokenAccount";
            writable: true;
          },
          {
            name: "poolBaseTokenAccount";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "poolQuoteTokenAccount";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "protocolFeeRecipient";
          },
          {
            name: "protocolFeeRecipientTokenAccount";
            writable: true;
            pda: {
              seeds: [
                {
                  kind: "account";
                  path: "protocolFeeRecipient";
                },
                {
                  kind: "account";
                  path: "quoteTokenProgram";
                },
                {
                  kind: "account";
                  path: "quoteMint";
                }
              ];
              program: {
                kind: "const";
                value: [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ];
              };
            };
          },
          {
            name: "baseTokenProgram";
          },
          {
            name: "quoteTokenProgram";
          },
          {
            name: "systemProgram";
            address: "11111111111111111111111111111111";
          },
          {
            name: "associatedTokenProgram";
            address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [
          {
            name: "baseAmountIn";
            type: "u64";
          },
          {
            name: "minQuoteAmountOut";
            type: "u64";
          }
        ];
      },
      {
        name: "updateAdmin";
        discriminator: [161, 176, 40, 213, 60, 184, 179, 228];
        accounts: [
          {
            name: "admin";
            signer: true;
            relations: ["globalConfig"];
          },
          {
            name: "globalConfig";
            writable: true;
          },
          {
            name: "newAdmin";
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [];
      },
      {
        name: "updateFeeConfig";
        discriminator: [104, 184, 103, 242, 88, 151, 107, 20];
        accounts: [
          {
            name: "admin";
            signer: true;
            relations: ["globalConfig"];
          },
          {
            name: "globalConfig";
            writable: true;
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [
          {
            name: "lpFeeBasisPoints";
            type: "u64";
          },
          {
            name: "protocolFeeBasisPoints";
            type: "u64";
          },
          {
            name: "protocolFeeRecipients";
            type: {
              array: ["pubkey", 8];
            };
          }
        ];
      },
      {
        name: "withdraw";
        discriminator: [183, 18, 70, 156, 148, 109, 161, 34];
        accounts: [
          {
            name: "pool";
            writable: true;
          },
          {
            name: "globalConfig";
          },
          {
            name: "user";
            signer: true;
          },
          {
            name: "baseMint";
            relations: ["pool"];
          },
          {
            name: "quoteMint";
            relations: ["pool"];
          },
          {
            name: "lpMint";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "userBaseTokenAccount";
            writable: true;
          },
          {
            name: "userQuoteTokenAccount";
            writable: true;
          },
          {
            name: "userPoolTokenAccount";
            writable: true;
          },
          {
            name: "poolBaseTokenAccount";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "poolQuoteTokenAccount";
            writable: true;
            relations: ["pool"];
          },
          {
            name: "tokenProgram";
            address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
          },
          {
            name: "token2022Program";
            address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
          },
          {
            name: "eventAuthority";
            pda: {
              seeds: [
                {
                  kind: "const";
                  value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121];
                }
              ];
            };
          },
          {
            name: "program";
          }
        ];
        args: [
          {
            name: "lpTokenAmountIn";
            type: "u64";
          },
          {
            name: "minBaseAmountOut";
            type: "u64";
          },
          {
            name: "minQuoteAmountOut";
            type: "u64";
          }
        ];
      }
    ];
    accounts: [
      {
        name: "globalConfig";
        discriminator: [149, 8, 156, 202, 160, 252, 176, 217];
      },
      {
        name: "pool";
        discriminator: [241, 154, 109, 4, 17, 177, 109, 188];
      }
    ];
    events: [
      {
        name: "buyEvent";
        discriminator: [103, 244, 82, 31, 44, 245, 119, 119];
      },
      {
        name: "createConfigEvent";
        discriminator: [107, 52, 89, 129, 55, 226, 81, 22];
      },
      {
        name: "createPoolEvent";
        discriminator: [177, 49, 12, 210, 160, 118, 167, 116];
      },
      {
        name: "depositEvent";
        discriminator: [120, 248, 61, 83, 31, 142, 107, 144];
      },
      {
        name: "disableEvent";
        discriminator: [107, 253, 193, 76, 228, 202, 27, 104];
      },
      {
        name: "extendAccountEvent";
        discriminator: [97, 97, 215, 144, 93, 146, 22, 124];
      },
      {
        name: "sellEvent";
        discriminator: [62, 47, 55, 10, 165, 3, 220, 42];
      },
      {
        name: "updateAdminEvent";
        discriminator: [225, 152, 171, 87, 246, 63, 66, 234];
      },
      {
        name: "updateFeeConfigEvent";
        discriminator: [90, 23, 65, 35, 62, 244, 188, 208];
      },
      {
        name: "withdrawEvent";
        discriminator: [22, 9, 133, 26, 160, 44, 71, 192];
      }
    ];
    errors: [
      {
        code: 6000;
        name: "feeBasisPointsExceedsMaximum";
      },
      {
        code: 6001;
        name: "zeroBaseAmount";
      },
      {
        code: 6002;
        name: "zeroQuoteAmount";
      },
      {
        code: 6003;
        name: "tooLittlePoolTokenLiquidity";
      },
      {
        code: 6004;
        name: "exceededSlippage";
      },
      {
        code: 6005;
        name: "invalidAdmin";
      },
      {
        code: 6006;
        name: "unsupportedBaseMint";
      },
      {
        code: 6007;
        name: "unsupportedQuoteMint";
      },
      {
        code: 6008;
        name: "invalidBaseMint";
      },
      {
        code: 6009;
        name: "invalidQuoteMint";
      },
      {
        code: 6010;
        name: "invalidLpMint";
      },
      {
        code: 6011;
        name: "allProtocolFeeRecipientsShouldBeNonZero";
      },
      {
        code: 6012;
        name: "unsortedNotUniqueProtocolFeeRecipients";
      },
      {
        code: 6013;
        name: "invalidProtocolFeeRecipient";
      },
      {
        code: 6014;
        name: "invalidPoolBaseTokenAccount";
      },
      {
        code: 6015;
        name: "invalidPoolQuoteTokenAccount";
      },
      {
        code: 6016;
        name: "buyMoreBaseAmountThanPoolReserves";
      },
      {
        code: 6017;
        name: "disabledCreatePool";
      },
      {
        code: 6018;
        name: "disabledDeposit";
      },
      {
        code: 6019;
        name: "disabledWithdraw";
      },
      {
        code: 6020;
        name: "disabledBuy";
      },
      {
        code: 6021;
        name: "disabledSell";
      },
      {
        code: 6022;
        name: "sameMint";
      },
      {
        code: 6023;
        name: "overflow";
      },
      {
        code: 6024;
        name: "truncation";
      },
      {
        code: 6025;
        name: "divisionByZero";
      },
      {
        code: 6026;
        name: "newSizeLessThanCurrentSize";
      },
      {
        code: 6027;
        name: "accountTypeNotSupported";
      }
    ];
    types: [
      {
        name: "buyEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "baseAmountOut";
              type: "u64";
            },
            {
              name: "maxQuoteAmountIn";
              type: "u64";
            },
            {
              name: "userBaseTokenReserves";
              type: "u64";
            },
            {
              name: "userQuoteTokenReserves";
              type: "u64";
            },
            {
              name: "poolBaseTokenReserves";
              type: "u64";
            },
            {
              name: "poolQuoteTokenReserves";
              type: "u64";
            },
            {
              name: "quoteAmountIn";
              type: "u64";
            },
            {
              name: "lpFeeBasisPoints";
              type: "u64";
            },
            {
              name: "lpFee";
              type: "u64";
            },
            {
              name: "protocolFeeBasisPoints";
              type: "u64";
            },
            {
              name: "protocolFee";
              type: "u64";
            },
            {
              name: "quoteAmountInWithLpFee";
              type: "u64";
            },
            {
              name: "userQuoteAmountIn";
              type: "u64";
            },
            {
              name: "pool";
              type: "pubkey";
            },
            {
              name: "user";
              type: "pubkey";
            },
            {
              name: "userBaseTokenAccount";
              type: "pubkey";
            },
            {
              name: "userQuoteTokenAccount";
              type: "pubkey";
            },
            {
              name: "protocolFeeRecipient";
              type: "pubkey";
            },
            {
              name: "protocolFeeRecipientTokenAccount";
              type: "pubkey";
            }
          ];
        };
      },
      {
        name: "createConfigEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "admin";
              type: "pubkey";
            },
            {
              name: "lpFeeBasisPoints";
              type: "u64";
            },
            {
              name: "protocolFeeBasisPoints";
              type: "u64";
            },
            {
              name: "protocolFeeRecipients";
              type: {
                array: ["pubkey", 8];
              };
            }
          ];
        };
      },
      {
        name: "createPoolEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "index";
              type: "u16";
            },
            {
              name: "creator";
              type: "pubkey";
            },
            {
              name: "baseMint";
              type: "pubkey";
            },
            {
              name: "quoteMint";
              type: "pubkey";
            },
            {
              name: "baseMintDecimals";
              type: "u8";
            },
            {
              name: "quoteMintDecimals";
              type: "u8";
            },
            {
              name: "baseAmountIn";
              type: "u64";
            },
            {
              name: "quoteAmountIn";
              type: "u64";
            },
            {
              name: "poolBaseAmount";
              type: "u64";
            },
            {
              name: "poolQuoteAmount";
              type: "u64";
            },
            {
              name: "minimumLiquidity";
              type: "u64";
            },
            {
              name: "initialLiquidity";
              type: "u64";
            },
            {
              name: "lpTokenAmountOut";
              type: "u64";
            },
            {
              name: "poolBump";
              type: "u8";
            },
            {
              name: "pool";
              type: "pubkey";
            },
            {
              name: "lpMint";
              type: "pubkey";
            },
            {
              name: "userBaseTokenAccount";
              type: "pubkey";
            },
            {
              name: "userQuoteTokenAccount";
              type: "pubkey";
            }
          ];
        };
      },
      {
        name: "depositEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "lpTokenAmountOut";
              type: "u64";
            },
            {
              name: "maxBaseAmountIn";
              type: "u64";
            },
            {
              name: "maxQuoteAmountIn";
              type: "u64";
            },
            {
              name: "userBaseTokenReserves";
              type: "u64";
            },
            {
              name: "userQuoteTokenReserves";
              type: "u64";
            },
            {
              name: "poolBaseTokenReserves";
              type: "u64";
            },
            {
              name: "poolQuoteTokenReserves";
              type: "u64";
            },
            {
              name: "baseAmountIn";
              type: "u64";
            },
            {
              name: "quoteAmountIn";
              type: "u64";
            },
            {
              name: "lpMintSupply";
              type: "u64";
            },
            {
              name: "pool";
              type: "pubkey";
            },
            {
              name: "user";
              type: "pubkey";
            },
            {
              name: "userBaseTokenAccount";
              type: "pubkey";
            },
            {
              name: "userQuoteTokenAccount";
              type: "pubkey";
            },
            {
              name: "userPoolTokenAccount";
              type: "pubkey";
            }
          ];
        };
      },
      {
        name: "disableEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "admin";
              type: "pubkey";
            },
            {
              name: "disableCreatePool";
              type: "bool";
            },
            {
              name: "disableDeposit";
              type: "bool";
            },
            {
              name: "disableWithdraw";
              type: "bool";
            },
            {
              name: "disableBuy";
              type: "bool";
            },
            {
              name: "disableSell";
              type: "bool";
            }
          ];
        };
      },
      {
        name: "extendAccountEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "account";
              type: "pubkey";
            },
            {
              name: "user";
              type: "pubkey";
            },
            {
              name: "currentSize";
              type: "u64";
            },
            {
              name: "newSize";
              type: "u64";
            }
          ];
        };
      },
      {
        name: "globalConfig";
        type: {
          kind: "struct";
          fields: [
            {
              name: "admin";
              docs: ["The admin pubkey"];
              type: "pubkey";
            },
            {
              name: "lpFeeBasisPoints";
              docs: ["The lp fee in basis points (0.01%)"];
              type: "u64";
            },
            {
              name: "protocolFeeBasisPoints";
              docs: ["The protocol fee in basis points (0.01%)"];
              type: "u64";
            },
            {
              name: "disableFlags";
              docs: [
                "Flags to disable certain functionality",
                "bit 0 - Disable create pool",
                "bit 1 - Disable deposit",
                "bit 2 - Disable withdraw",
                "bit 3 - Disable buy",
                "bit 4 - Disable sell"
              ];
              type: "u8";
            },
            {
              name: "protocolFeeRecipients";
              docs: ["Addresses of the protocol fee recipients"];
              type: {
                array: ["pubkey", 8];
              };
            }
          ];
        };
      },
      {
        name: "pool";
        type: {
          kind: "struct";
          fields: [
            {
              name: "poolBump";
              type: "u8";
            },
            {
              name: "index";
              type: "u16";
            },
            {
              name: "creator";
              type: "pubkey";
            },
            {
              name: "baseMint";
              type: "pubkey";
            },
            {
              name: "quoteMint";
              type: "pubkey";
            },
            {
              name: "lpMint";
              type: "pubkey";
            },
            {
              name: "poolBaseTokenAccount";
              type: "pubkey";
            },
            {
              name: "poolQuoteTokenAccount";
              type: "pubkey";
            },
            {
              name: "lpSupply";
              docs: ["True circulating supply without burns and lock-ups"];
              type: "u64";
            }
          ];
        };
      },
      {
        name: "sellEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "baseAmountIn";
              type: "u64";
            },
            {
              name: "minQuoteAmountOut";
              type: "u64";
            },
            {
              name: "userBaseTokenReserves";
              type: "u64";
            },
            {
              name: "userQuoteTokenReserves";
              type: "u64";
            },
            {
              name: "poolBaseTokenReserves";
              type: "u64";
            },
            {
              name: "poolQuoteTokenReserves";
              type: "u64";
            },
            {
              name: "quoteAmountOut";
              type: "u64";
            },
            {
              name: "lpFeeBasisPoints";
              type: "u64";
            },
            {
              name: "lpFee";
              type: "u64";
            },
            {
              name: "protocolFeeBasisPoints";
              type: "u64";
            },
            {
              name: "protocolFee";
              type: "u64";
            },
            {
              name: "quoteAmountOutWithoutLpFee";
              type: "u64";
            },
            {
              name: "userQuoteAmountOut";
              type: "u64";
            },
            {
              name: "pool";
              type: "pubkey";
            },
            {
              name: "user";
              type: "pubkey";
            },
            {
              name: "userBaseTokenAccount";
              type: "pubkey";
            },
            {
              name: "userQuoteTokenAccount";
              type: "pubkey";
            },
            {
              name: "protocolFeeRecipient";
              type: "pubkey";
            },
            {
              name: "protocolFeeRecipientTokenAccount";
              type: "pubkey";
            }
          ];
        };
      },
      {
        name: "updateAdminEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "admin";
              type: "pubkey";
            },
            {
              name: "newAdmin";
              type: "pubkey";
            }
          ];
        };
      },
      {
        name: "updateFeeConfigEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "admin";
              type: "pubkey";
            },
            {
              name: "lpFeeBasisPoints";
              type: "u64";
            },
            {
              name: "protocolFeeBasisPoints";
              type: "u64";
            },
            {
              name: "protocolFeeRecipients";
              type: {
                array: ["pubkey", 8];
              };
            }
          ];
        };
      },
      {
        name: "withdrawEvent";
        type: {
          kind: "struct";
          fields: [
            {
              name: "timestamp";
              type: "i64";
            },
            {
              name: "lpTokenAmountIn";
              type: "u64";
            },
            {
              name: "minBaseAmountOut";
              type: "u64";
            },
            {
              name: "minQuoteAmountOut";
              type: "u64";
            },
            {
              name: "userBaseTokenReserves";
              type: "u64";
            },
            {
              name: "userQuoteTokenReserves";
              type: "u64";
            },
            {
              name: "poolBaseTokenReserves";
              type: "u64";
            },
            {
              name: "poolQuoteTokenReserves";
              type: "u64";
            },
            {
              name: "baseAmountOut";
              type: "u64";
            },
            {
              name: "quoteAmountOut";
              type: "u64";
            },
            {
              name: "lpMintSupply";
              type: "u64";
            },
            {
              name: "pool";
              type: "pubkey";
            },
            {
              name: "user";
              type: "pubkey";
            },
            {
              name: "userBaseTokenAccount";
              type: "pubkey";
            },
            {
              name: "userQuoteTokenAccount";
              type: "pubkey";
            },
            {
              name: "userPoolTokenAccount";
              type: "pubkey";
            }
          ];
        };
      }
    ];
  };


// export type PumpSwap = {
//   address: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
//   metadata: {
//       name: "pumpAmm",
//       version: "0.1.0",
//       spec: "0.1.0",
//       description: "Created with Anchor"
//   },
//   instructions: [{
//       name: "buy",
//       discriminator: [102, 6, 61, 18, 1, 218, 235, 234],
//       accounts: [{
//           name: "pool"
//       }, {
//           name: "user",
//           writable: true,
//           signer: true
//       }, {
//           name: "globalConfig"
//       }, {
//           name: "baseMint",
//           relations: ["pool"]
//       }, {
//           name: "quoteMint",
//           relations: ["pool"]
//       }, {
//           name: "userBaseTokenAccount",
//           writable: true
//       }, {
//           name: "userQuoteTokenAccount",
//           writable: true
//       }, {
//           name: "poolBaseTokenAccount",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "poolQuoteTokenAccount",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "protocolFeeRecipient"
//       }, {
//           name: "protocolFeeRecipientTokenAccount",
//           writable: true,
//           pda: {
//               seeds: [{
//                   kind: "account",
//                   path: "protocolFeeRecipient"
//               }, {
//                   kind: "account",
//                   path: "quoteTokenProgram"
//               }, {
//                   kind: "account",
//                   path: "quoteMint"
//               }],
//               program: {
//                   kind: "const",
//                   value: [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89]
//               }
//           }
//       }, {
//           name: "baseTokenProgram"
//       }, {
//           name: "quoteTokenProgram"
//       }, {
//           name: "systemProgram",
//           address: "11111111111111111111111111111111"
//       }, {
//           name: "associatedTokenProgram",
//           address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: [{
//           name: "baseAmountOut",
//           type: "u64"
//       }, {
//           name: "maxQuoteAmountIn",
//           type: "u64"
//       }]
//   }, {
//       name: "createConfig",
//       discriminator: [201, 207, 243, 114, 75, 111, 47, 189],
//       accounts: [{
//           name: "admin",
//           writable: true,
//           signer: true,
//           address: "8LWu7QM2dGR1G8nKDHthckea57bkCzXyBTAKPJUBDHo8"
//       }, {
//           name: "globalConfig",
//           writable: true,
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103]
//               }]
//           }
//       }, {
//           name: "systemProgram",
//           address: "11111111111111111111111111111111"
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: [{
//           name: "lpFeeBasisPoints",
//           type: "u64"
//       }, {
//           name: "protocolFeeBasisPoints",
//           type: "u64"
//       }, {
//           name: "protocolFeeRecipients",
//           type: {
//               array: ["pubkey", 8]
//           }
//       }]
//   }, {
//       name: "createPool",
//       discriminator: [233, 146, 209, 142, 207, 104, 64, 188],
//       accounts: [{
//           name: "pool",
//           writable: true,
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [112, 111, 111, 108]
//               }, {
//                   kind: "arg",
//                   path: "index"
//               }, {
//                   kind: "account",
//                   path: "creator"
//               }, {
//                   kind: "account",
//                   path: "baseMint"
//               }, {
//                   kind: "account",
//                   path: "quoteMint"
//               }]
//           }
//       }, {
//           name: "globalConfig"
//       }, {
//           name: "creator",
//           writable: true,
//           signer: true
//       }, {
//           name: "baseMint"
//       }, {
//           name: "quoteMint"
//       }, {
//           name: "lpMint",
//           writable: true,
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [112, 111, 111, 108, 95, 108, 112, 95, 109, 105, 110, 116]
//               }, {
//                   kind: "account",
//                   path: "pool"
//               }]
//           }
//       }, {
//           name: "userBaseTokenAccount",
//           writable: true
//       }, {
//           name: "userQuoteTokenAccount",
//           writable: true
//       }, {
//           name: "userPoolTokenAccount",
//           writable: true,
//           pda: {
//               seeds: [{
//                   kind: "account",
//                   path: "creator"
//               }, {
//                   kind: "account",
//                   path: "token2022Program"
//               }, {
//                   kind: "account",
//                   path: "lpMint"
//               }],
//               program: {
//                   kind: "const",
//                   value: [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89]
//               }
//           }
//       }, {
//           name: "poolBaseTokenAccount",
//           writable: true,
//           pda: {
//               seeds: [{
//                   kind: "account",
//                   path: "pool"
//               }, {
//                   kind: "account",
//                   path: "baseTokenProgram"
//               }, {
//                   kind: "account",
//                   path: "baseMint"
//               }],
//               program: {
//                   kind: "const",
//                   value: [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89]
//               }
//           }
//       }, {
//           name: "poolQuoteTokenAccount",
//           writable: true,
//           pda: {
//               seeds: [{
//                   kind: "account",
//                   path: "pool"
//               }, {
//                   kind: "account",
//                   path: "quoteTokenProgram"
//               }, {
//                   kind: "account",
//                   path: "quoteMint"
//               }],
//               program: {
//                   kind: "const",
//                   value: [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89]
//               }
//           }
//       }, {
//           name: "systemProgram",
//           address: "11111111111111111111111111111111"
//       }, {
//           name: "token2022Program",
//           address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
//       }, {
//           name: "baseTokenProgram"
//       }, {
//           name: "quoteTokenProgram"
//       }, {
//           name: "associatedTokenProgram",
//           address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: [{
//           name: "index",
//           type: "u16"
//       }, {
//           name: "baseAmountIn",
//           type: "u64"
//       }, {
//           name: "quoteAmountIn",
//           type: "u64"
//       }]
//   }, {
//       name: "deposit",
//       discriminator: [242, 35, 198, 137, 82, 225, 242, 182],
//       accounts: [{
//           name: "pool",
//           writable: true
//       }, {
//           name: "globalConfig"
//       }, {
//           name: "user",
//           signer: true
//       }, {
//           name: "baseMint",
//           relations: ["pool"]
//       }, {
//           name: "quoteMint",
//           relations: ["pool"]
//       }, {
//           name: "lpMint",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "userBaseTokenAccount",
//           writable: true
//       }, {
//           name: "userQuoteTokenAccount",
//           writable: true
//       }, {
//           name: "userPoolTokenAccount",
//           writable: true
//       }, {
//           name: "poolBaseTokenAccount",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "poolQuoteTokenAccount",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "tokenProgram",
//           address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//       }, {
//           name: "token2022Program",
//           address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: [{
//           name: "lpTokenAmountOut",
//           type: "u64"
//       }, {
//           name: "maxBaseAmountIn",
//           type: "u64"
//       }, {
//           name: "maxQuoteAmountIn",
//           type: "u64"
//       }]
//   }, {
//       name: "disable",
//       discriminator: [185, 173, 187, 90, 216, 15, 238, 233],
//       accounts: [{
//           name: "admin",
//           signer: true,
//           relations: ["globalConfig"]
//       }, {
//           name: "globalConfig",
//           writable: true
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: [{
//           name: "disableCreatePool",
//           type: "bool"
//       }, {
//           name: "disableDeposit",
//           type: "bool"
//       }, {
//           name: "disableWithdraw",
//           type: "bool"
//       }, {
//           name: "disableBuy",
//           type: "bool"
//       }, {
//           name: "disableSell",
//           type: "bool"
//       }]
//   }, {
//       name: "extendAccount",
//       discriminator: [234, 102, 194, 203, 150, 72, 62, 229],
//       accounts: [{
//           name: "account",
//           writable: true
//       }, {
//           name: "user",
//           signer: true
//       }, {
//           name: "systemProgram",
//           address: "11111111111111111111111111111111"
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: []
//   }, {
//       name: "sell",
//       discriminator: [51, 230, 133, 164, 1, 127, 131, 173],
//       accounts: [{
//           name: "pool"
//       }, {
//           name: "user",
//           writable: true,
//           signer: true
//       }, {
//           name: "globalConfig"
//       }, {
//           name: "baseMint",
//           relations: ["pool"]
//       }, {
//           name: "quoteMint",
//           relations: ["pool"]
//       }, {
//           name: "userBaseTokenAccount",
//           writable: true
//       }, {
//           name: "userQuoteTokenAccount",
//           writable: true
//       }, {
//           name: "poolBaseTokenAccount",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "poolQuoteTokenAccount",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "protocolFeeRecipient"
//       }, {
//           name: "protocolFeeRecipientTokenAccount",
//           writable: true,
//           pda: {
//               seeds: [{
//                   kind: "account",
//                   path: "protocolFeeRecipient"
//               }, {
//                   kind: "account",
//                   path: "quoteTokenProgram"
//               }, {
//                   kind: "account",
//                   path: "quoteMint"
//               }],
//               program: {
//                   kind: "const",
//                   value: [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89]
//               }
//           }
//       }, {
//           name: "baseTokenProgram"
//       }, {
//           name: "quoteTokenProgram"
//       }, {
//           name: "systemProgram",
//           address: "11111111111111111111111111111111"
//       }, {
//           name: "associatedTokenProgram",
//           address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: [{
//           name: "baseAmountIn",
//           type: "u64"
//       }, {
//           name: "minQuoteAmountOut",
//           type: "u64"
//       }]
//   }, {
//       name: "updateAdmin",
//       discriminator: [161, 176, 40, 213, 60, 184, 179, 228],
//       accounts: [{
//           name: "admin",
//           signer: true,
//           relations: ["globalConfig"]
//       }, {
//           name: "globalConfig",
//           writable: true
//       }, {
//           name: "newAdmin"
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: []
//   }, {
//       name: "updateFeeConfig",
//       discriminator: [104, 184, 103, 242, 88, 151, 107, 20],
//       accounts: [{
//           name: "admin",
//           signer: true,
//           relations: ["globalConfig"]
//       }, {
//           name: "globalConfig",
//           writable: true
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: [{
//           name: "lpFeeBasisPoints",
//           type: "u64"
//       }, {
//           name: "protocolFeeBasisPoints",
//           type: "u64"
//       }, {
//           name: "protocolFeeRecipients",
//           type: {
//               array: ["pubkey", 8]
//           }
//       }]
//   }, {
//       name: "withdraw",
//       discriminator: [183, 18, 70, 156, 148, 109, 161, 34],
//       accounts: [{
//           name: "pool",
//           writable: true
//       }, {
//           name: "globalConfig"
//       }, {
//           name: "user",
//           signer: true
//       }, {
//           name: "baseMint",
//           relations: ["pool"]
//       }, {
//           name: "quoteMint",
//           relations: ["pool"]
//       }, {
//           name: "lpMint",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "userBaseTokenAccount",
//           writable: true
//       }, {
//           name: "userQuoteTokenAccount",
//           writable: true
//       }, {
//           name: "userPoolTokenAccount",
//           writable: true
//       }, {
//           name: "poolBaseTokenAccount",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "poolQuoteTokenAccount",
//           writable: true,
//           relations: ["pool"]
//       }, {
//           name: "tokenProgram",
//           address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//       }, {
//           name: "token2022Program",
//           address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
//       }, {
//           name: "eventAuthority",
//           pda: {
//               seeds: [{
//                   kind: "const",
//                   value: [95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
//               }]
//           }
//       }, {
//           name: "program"
//       }],
//       args: [{
//           name: "lpTokenAmountIn",
//           type: "u64"
//       }, {
//           name: "minBaseAmountOut",
//           type: "u64"
//       }, {
//           name: "minQuoteAmountOut",
//           type: "u64"
//       }]
//   }],
//   accounts: [{
//       name: "GlobalConfig",
//       discriminator: [149, 8, 156, 202, 160, 252, 176, 217]
//   }, {
//       name: "Pool",
//       discriminator: [241, 154, 109, 4, 17, 177, 109, 188]
//   }],
//   events: [{
//       name: "BuyEvent",
//       discriminator: [103, 244, 82, 31, 44, 245, 119, 119]
//   }, {
//       name: "CreateConfigEvent",
//       discriminator: [107, 52, 89, 129, 55, 226, 81, 22]
//   }, {
//       name: "CreatePoolEvent",
//       discriminator: [177, 49, 12, 210, 160, 118, 167, 116]
//   }, {
//       name: "DepositEvent",
//       discriminator: [120, 248, 61, 83, 31, 142, 107, 144]
//   }, {
//       name: "DisableEvent",
//       discriminator: [107, 253, 193, 76, 228, 202, 27, 104]
//   }, {
//       name: "ExtendAccountEvent",
//       discriminator: [97, 97, 215, 144, 93, 146, 22, 124]
//   }, {
//       name: "SellEvent",
//       discriminator: [62, 47, 55, 10, 165, 3, 220, 42]
//   }, {
//       name: "UpdateAdminEvent",
//       discriminator: [225, 152, 171, 87, 246, 63, 66, 234]
//   }, {
//       name: "UpdateFeeConfigEvent",
//       discriminator: [90, 23, 65, 35, 62, 244, 188, 208]
//   }, {
//       name: "WithdrawEvent",
//       discriminator: [22, 9, 133, 26, 160, 44, 71, 192]
//   }],
//   errors: [{
//       code: 6e3,
//       name: "FeeBasisPointsExceedsMaximum"
//   }, {
//       code: 6001,
//       name: "ZeroBaseAmount"
//   }, {
//       code: 6002,
//       name: "ZeroQuoteAmount"
//   }, {
//       code: 6003,
//       name: "TooLittlePoolTokenLiquidity"
//   }, {
//       code: 6004,
//       name: "ExceededSlippage"
//   }, {
//       code: 6005,
//       name: "InvalidAdmin"
//   }, {
//       code: 6006,
//       name: "UnsupportedBaseMint"
//   }, {
//       code: 6007,
//       name: "UnsupportedQuoteMint"
//   }, {
//       code: 6008,
//       name: "InvalidBaseMint"
//   }, {
//       code: 6009,
//       name: "InvalidQuoteMint"
//   }, {
//       code: 6010,
//       name: "InvalidLpMint"
//   }, {
//       code: 6011,
//       name: "AllProtocolFeeRecipientsShouldBeNonZero"
//   }, {
//       code: 6012,
//       name: "UnsortedNotUniqueProtocolFeeRecipients"
//   }, {
//       code: 6013,
//       name: "InvalidProtocolFeeRecipient"
//   }, {
//       code: 6014,
//       name: "InvalidPoolBaseTokenAccount"
//   }, {
//       code: 6015,
//       name: "InvalidPoolQuoteTokenAccount"
//   }, {
//       code: 6016,
//       name: "BuyMoreBaseAmountThanPoolReserves"
//   }, {
//       code: 6017,
//       name: "DisabledCreatePool"
//   }, {
//       code: 6018,
//       name: "DisabledDeposit"
//   }, {
//       code: 6019,
//       name: "DisabledWithdraw"
//   }, {
//       code: 6020,
//       name: "DisabledBuy"
//   }, {
//       code: 6021,
//       name: "DisabledSell"
//   }, {
//       code: 6022,
//       name: "SameMint"
//   }, {
//       code: 6023,
//       name: "Overflow"
//   }, {
//       code: 6024,
//       name: "Truncation"
//   }, {
//       code: 6025,
//       name: "DivisionByZero"
//   }, {
//       code: 6026,
//       name: "NewSizeLessThanCurrentSize"
//   }, {
//       code: 6027,
//       name: "AccountTypeNotSupported"
//   }],
//   types: [{
//       name: "BuyEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "baseAmountOut",
//               type: "u64"
//           }, {
//               name: "maxQuoteAmountIn",
//               type: "u64"
//           }, {
//               name: "userBaseTokenReserves",
//               type: "u64"
//           }, {
//               name: "userQuoteTokenReserves",
//               type: "u64"
//           }, {
//               name: "poolBaseTokenReserves",
//               type: "u64"
//           }, {
//               name: "poolQuoteTokenReserves",
//               type: "u64"
//           }, {
//               name: "quoteAmountIn",
//               type: "u64"
//           }, {
//               name: "lpFeeBasisPoints",
//               type: "u64"
//           }, {
//               name: "lpFee",
//               type: "u64"
//           }, {
//               name: "protocolFeeBasisPoints",
//               type: "u64"
//           }, {
//               name: "protocolFee",
//               type: "u64"
//           }, {
//               name: "quoteAmountInWithLpFee",
//               type: "u64"
//           }, {
//               name: "userQuoteAmountIn",
//               type: "u64"
//           }, {
//               name: "pool",
//               type: "pubkey"
//           }, {
//               name: "user",
//               type: "pubkey"
//           }, {
//               name: "userBaseTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "userQuoteTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "protocolFeeRecipient",
//               type: "pubkey"
//           }, {
//               name: "protocolFeeRecipientTokenAccount",
//               type: "pubkey"
//           }]
//       }
//   }, {
//       name: "CreateConfigEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "admin",
//               type: "pubkey"
//           }, {
//               name: "lpFeeBasisPoints",
//               type: "u64"
//           }, {
//               name: "protocolFeeBasisPoints",
//               type: "u64"
//           }, {
//               name: "protocolFeeRecipients",
//               type: {
//                   array: ["pubkey", 8]
//               }
//           }]
//       }
//   }, {
//       name: "CreatePoolEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "index",
//               type: "u16"
//           }, {
//               name: "creator",
//               type: "pubkey"
//           }, {
//               name: "baseMint",
//               type: "pubkey"
//           }, {
//               name: "quoteMint",
//               type: "pubkey"
//           }, {
//               name: "baseMintDecimals",
//               type: "u8"
//           }, {
//               name: "quoteMintDecimals",
//               type: "u8"
//           }, {
//               name: "baseAmountIn",
//               type: "u64"
//           }, {
//               name: "quoteAmountIn",
//               type: "u64"
//           }, {
//               name: "poolBaseAmount",
//               type: "u64"
//           }, {
//               name: "poolQuoteAmount",
//               type: "u64"
//           }, {
//               name: "minimumLiquidity",
//               type: "u64"
//           }, {
//               name: "initialLiquidity",
//               type: "u64"
//           }, {
//               name: "lpTokenAmountOut",
//               type: "u64"
//           }, {
//               name: "poolBump",
//               type: "u8"
//           }, {
//               name: "pool",
//               type: "pubkey"
//           }, {
//               name: "lpMint",
//               type: "pubkey"
//           }, {
//               name: "userBaseTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "userQuoteTokenAccount",
//               type: "pubkey"
//           }]
//       }
//   }, {
//       name: "DepositEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "lpTokenAmountOut",
//               type: "u64"
//           }, {
//               name: "maxBaseAmountIn",
//               type: "u64"
//           }, {
//               name: "maxQuoteAmountIn",
//               type: "u64"
//           }, {
//               name: "userBaseTokenReserves",
//               type: "u64"
//           }, {
//               name: "userQuoteTokenReserves",
//               type: "u64"
//           }, {
//               name: "poolBaseTokenReserves",
//               type: "u64"
//           }, {
//               name: "poolQuoteTokenReserves",
//               type: "u64"
//           }, {
//               name: "baseAmountIn",
//               type: "u64"
//           }, {
//               name: "quoteAmountIn",
//               type: "u64"
//           }, {
//               name: "lpMintSupply",
//               type: "u64"
//           }, {
//               name: "pool",
//               type: "pubkey"
//           }, {
//               name: "user",
//               type: "pubkey"
//           }, {
//               name: "userBaseTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "userQuoteTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "userPoolTokenAccount",
//               type: "pubkey"
//           }]
//       }
//   }, {
//       name: "DisableEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "admin",
//               type: "pubkey"
//           }, {
//               name: "disableCreatePool",
//               type: "bool"
//           }, {
//               name: "disableDeposit",
//               type: "bool"
//           }, {
//               name: "disableWithdraw",
//               type: "bool"
//           }, {
//               name: "disableBuy",
//               type: "bool"
//           }, {
//               name: "disableSell",
//               type: "bool"
//           }]
//       }
//   }, {
//       name: "ExtendAccountEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "account",
//               type: "pubkey"
//           }, {
//               name: "user",
//               type: "pubkey"
//           }, {
//               name: "currentSize",
//               type: "u64"
//           }, {
//               name: "newSize",
//               type: "u64"
//           }]
//       }
//   }, {
//       name: "GlobalConfig",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "admin",
//               docs: ["The admin pubkey"],
//               type: "pubkey"
//           }, {
//               name: "lpFeeBasisPoints",
//               docs: ["The lp fee in basis points (0.01%)"],
//               type: "u64"
//           }, {
//               name: "protocolFeeBasisPoints",
//               docs: ["The protocol fee in basis points (0.01%)"],
//               type: "u64"
//           }, {
//               name: "disableFlags",
//               docs: ["Flags to disable certain functionality", "bit 0 - Disable create pool", "bit 1 - Disable deposit", "bit 2 - Disable withdraw", "bit 3 - Disable buy", "bit 4 - Disable sell"],
//               type: "u8"
//           }, {
//               name: "protocolFeeRecipients",
//               docs: ["Addresses of the protocol fee recipients"],
//               type: {
//                   array: ["pubkey", 8]
//               }
//           }]
//       }
//   }, {
//       name: "Pool",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "poolBump",
//               type: "u8"
//           }, {
//               name: "index",
//               type: "u16"
//           }, {
//               name: "creator",
//               type: "pubkey"
//           }, {
//               name: "baseMint",
//               type: "pubkey"
//           }, {
//               name: "quoteMint",
//               type: "pubkey"
//           }, {
//               name: "lpMint",
//               type: "pubkey"
//           }, {
//               name: "poolBaseTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "poolQuoteTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "lpSupply",
//               docs: ["True circulating supply without burns and lock-ups"],
//               type: "u64"
//           }]
//       }
//   }, {
//       name: "SellEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "baseAmountIn",
//               type: "u64"
//           }, {
//               name: "minQuoteAmountOut",
//               type: "u64"
//           }, {
//               name: "userBaseTokenReserves",
//               type: "u64"
//           }, {
//               name: "userQuoteTokenReserves",
//               type: "u64"
//           }, {
//               name: "poolBaseTokenReserves",
//               type: "u64"
//           }, {
//               name: "poolQuoteTokenReserves",
//               type: "u64"
//           }, {
//               name: "quoteAmountOut",
//               type: "u64"
//           }, {
//               name: "lpFeeBasisPoints",
//               type: "u64"
//           }, {
//               name: "lpFee",
//               type: "u64"
//           }, {
//               name: "protocolFeeBasisPoints",
//               type: "u64"
//           }, {
//               name: "protocolFee",
//               type: "u64"
//           }, {
//               name: "quoteAmountOutWithoutLpFee",
//               type: "u64"
//           }, {
//               name: "userQuoteAmountOut",
//               type: "u64"
//           }, {
//               name: "pool",
//               type: "pubkey"
//           }, {
//               name: "user",
//               type: "pubkey"
//           }, {
//               name: "userBaseTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "userQuoteTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "protocolFeeRecipient",
//               type: "pubkey"
//           }, {
//               name: "protocolFeeRecipientTokenAccount",
//               type: "pubkey"
//           }]
//       }
//   }, {
//       name: "UpdateAdminEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "admin",
//               type: "pubkey"
//           }, {
//               name: "newAdmin",
//               type: "pubkey"
//           }]
//       }
//   }, {
//       name: "UpdateFeeConfigEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "admin",
//               type: "pubkey"
//           }, {
//               name: "lpFeeBasisPoints",
//               type: "u64"
//           }, {
//               name: "protocolFeeBasisPoints",
//               type: "u64"
//           }, {
//               name: "protocolFeeRecipients",
//               type: {
//                   array: ["pubkey", 8]
//               }
//           }]
//       }
//   }, {
//       name: "WithdrawEvent",
//       type: {
//           kind: "struct",
//           fields: [{
//               name: "timestamp",
//               type: "i64"
//           }, {
//               name: "lpTokenAmountIn",
//               type: "u64"
//           }, {
//               name: "minBaseAmountOut",
//               type: "u64"
//           }, {
//               name: "minQuoteAmountOut",
//               type: "u64"
//           }, {
//               name: "userBaseTokenReserves",
//               type: "u64"
//           }, {
//               name: "userQuoteTokenReserves",
//               type: "u64"
//           }, {
//               name: "poolBaseTokenReserves",
//               type: "u64"
//           }, {
//               name: "poolQuoteTokenReserves",
//               type: "u64"
//           }, {
//               name: "baseAmountOut",
//               type: "u64"
//           }, {
//               name: "quoteAmountOut",
//               type: "u64"
//           }, {
//               name: "lpMintSupply",
//               type: "u64"
//           }, {
//               name: "pool",
//               type: "pubkey"
//           }, {
//               name: "user",
//               type: "pubkey"
//           }, {
//               name: "userBaseTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "userQuoteTokenAccount",
//               type: "pubkey"
//           }, {
//               name: "userPoolTokenAccount",
//               type: "pubkey"
//           }]
//       }
//   }]
// };
