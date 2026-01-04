/**
 * Update order billing/shipping address without using the page form.
 *
 * Requirements:
 * - You are on the same origin (logged in) so cookies/session apply.
 * - ResolveAPIPath and OrderProperties exist (they do in your code).
 *
 * Notes:
 * - Endpoint is "/Location/Updateddress" (typo is real in source).
 * - For shipping, server logic expects IsShippingAddress=true and may also want ParentLocationId/ParentAccountLocationId.
 * - If you want delivery method changes, that is a second call (see below).
 */
async function updateOrderAddressDirect({
      kind, // "billing" | "shipping"
      orderId = (window.OrderProperties?.OrderId ?? document.querySelector("#hfOrderId")?.value),
      accountId = window.OrderProperties?.AccountId,

      // Optional: if you know it; otherwise pass 0
      addressId = 0,

      address1,
      address2 = "",
      city,
      state,
      postal,
      postalExt = "",
      country = "USA",

      // Shipping-only extras (safe to include; server can ignore for billing)
      freeFormContact = "",
      parentLocationId = "",
      parentAccountLocationId = "",
      isShippingAddress = (kind === "shipping"),
} = {}) {
      if(!kind) throw new Error(`kind is required: "billing" or "shipping"`);
      if(!orderId) throw new Error("orderId missing (hfOrderId / OrderProperties.OrderId not found)");
      if(!accountId) throw new Error("accountId missing (OrderProperties.AccountId not found)");
      if(!address1 || !city || !state || !postal) {
            throw new Error("address1, city, state, postal are required");
      }

      // Matches your modal's filter (removes non-ASCII 0x20-0x7E)
      const filterSpecialChars = (text) => {
            text = String(text ?? "");
            if(/^[\x20-\x7E]*$/.test(text)) return text;
            let out = "";
            for(const ch of text) {
                  if(/^[\x20-\x7E]$/.test(ch)) out += ch;
            }
            return out;
      };

      const payload = {
            OrderId: orderId,
            AccountId: accountId,
            AddressId: Number(addressId) || 0,
            Address1: filterSpecialChars(address1),
            Address2: filterSpecialChars(address2),
            City: filterSpecialChars(city),
            State: String(state ?? ""),
            Postal: filterSpecialChars(postal),
            PostalExt: filterSpecialChars(postalExt),
            Country: String(country ?? "USA"),

            // shipping extras (harmless if kind=billing; server may ignore)
            FreeFormContact: filterSpecialChars(freeFormContact),
            ParentLocationId: parentLocationId,
            ParentAccountLocationId: parentAccountLocationId,
            IsShippingAddress: !!isShippingAddress,
      };

      const url = ResolveAPIPath("/Location/Updateddress");

      // If your site uses ASP.NET anti-forgery, it’s often in a hidden input.
      // If not present, this will just be null and ignored.
      const antiForgery =
            document.querySelector('input[name="__RequestVerificationToken"]')?.value ??
            document.querySelector('input[name="RequestVerificationToken"]')?.value ??
            null;

      const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                  "content-type": "application/json; charset=UTF-8",
                  ...(antiForgery ? {"RequestVerificationToken": antiForgery} : {}),
                  ...(antiForgery ? {"__RequestVerificationToken": antiForgery} : {}),
            },
            body: JSON.stringify(payload),
      });

      // Many older stacks return JSON even on 200 with IsSuccess false
      const text = await res.text();
      let json;
      try {json = JSON.parse(text);} catch {json = {raw: text};}

      if(!res.ok) {
            throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
      }
      if(json && json.IsSuccess === false) {
            throw new Error(json.Message || "Update failed (IsSuccess=false)");
      }

      return json;
}


// Update SHIPPING address
updateOrderAddressDirect({
      kind: "shipping",
      addressId: 0, // or existing ID if you know it
      address1: "12 Example St",
      address2: "",
      city: "Springwood",
      state: "QLD",
      postal: "4127",
      country: "AU",
      freeFormContact: "Tristan - 04xx xxx xxx",
      parentLocationId: "",           // optional
      parentAccountLocationId: "",    // optional
}).then(console.log).catch(console.error);

// Update BILLING address
updateOrderAddressDirect({
      kind: "billing",
      address1: "12 Example St",
      city: "Springwood",
      state: "QLD",
      postal: "4127",
      country: "AU",
}).then(console.log).catch(console.error);
