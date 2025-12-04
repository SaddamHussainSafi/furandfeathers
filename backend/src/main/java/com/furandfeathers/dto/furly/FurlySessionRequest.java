package com.furandfeathers.dto.furly;

import com.furandfeathers.enums.FurlyIntent;

public class FurlySessionRequest {

    private FurlyIntent intent;
    private String guestSessionId;

    public FurlyIntent getIntent() {
        return intent;
    }

    public void setIntent(FurlyIntent intent) {
        this.intent = intent;
    }

    public String getGuestSessionId() {
        return guestSessionId;
    }

    public void setGuestSessionId(String guestSessionId) {
        this.guestSessionId = guestSessionId;
    }
}
