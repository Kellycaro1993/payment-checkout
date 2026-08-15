import axios from 'axios';

const WOMPI_API_URL = import.meta.env?.VITE_WOMPI_API_URL;
const WOMPI_PUBLIC_KEY = import.meta.env?.VITE_WOMPI_PUBLIC_KEY;

export interface TokenizeCardPayload {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

interface WompiTokenResponse {
  data: {
    id: string;
  };
}

interface WompiMerchantResponse {
  data: {
    presigned_acceptance: {
      acceptance_token: string;
    };
    presigned_personal_data_auth: {
      acceptance_token: string;
    };
  };
}

export interface AcceptanceTokens {
  acceptanceToken: string;
  acceptPersonalAuth: string;
}

export const paymentService = {
  tokenizeCard: async (
    data: TokenizeCardPayload,
  ): Promise<string> => {
    const response = await axios.post<WompiTokenResponse>(
      `${WOMPI_API_URL}/tokens/cards`,
      {
        number: data.number,
        cvc: data.cvc,
        exp_month: data.expMonth,
        exp_year: data.expYear,
        card_holder: data.cardHolder,
      },
      {
        headers: {
          Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`,
        },
      },
    );

    return response.data.data.id;
  },

  getAcceptanceTokens: async (): Promise<AcceptanceTokens> => {
    const response = await axios.get<WompiMerchantResponse>(
      `${WOMPI_API_URL}/merchants/${WOMPI_PUBLIC_KEY}`,
    );

    return {
      acceptanceToken:
        response.data.data.presigned_acceptance.acceptance_token,

      acceptPersonalAuth:
        response.data.data.presigned_personal_data_auth.acceptance_token,
    };
  },
};
