angular.module('starter')

.factory('PartnerService', function() {

    var thisShop = {
        "ShopName": "",
        "Hours": "",
        "ContactName": "",
        "PhoneNumber": "",
        "WebAddress": "",
        "Address": "",
        "Location": "",
        "Pending": ""
    };



    function SearchPartners(searchPhrase) {
        var PartnerQuery = new Parse.Query('Shop');
        var pendingQuery = new Parse.Query('Request');
        var queryType = "";
        var length = searchPhrase.length;
        var a = length - 4;
        if (searchPhrase.substr(a, 1) === ".") {
            queryType = "EmailAddress";
        } else {
            queryType = "ShopName";
        }

        console.log(queryType);
        console.log(searchPhrase);

        PartnerQuery.equalTo(queryType, searchPhrase);
        PartnerQuery.first({
            success: function(partner) {
                if (partner) {
                    pendingQuery.equalTo('Shop', partner);
                    pendingQuery.equalTo('Completed', false);
                    pendingQuery.count({
                        success: function(count) {
                            thisShop.Pending = "Pending: " + count;
                            thisShop.ShopName = "Partner Name:" + partner.get('ShopName');
                            thisShop.Hours = "Hours: " + partner.get('Hours');
                            thisShop.ContactName = "Contact Name: " + partner.get('ContactName');
                            thisShop.PhoneNumber = "Phone: " + partner.get('PhoneNumber');
                            thisShop.WebAddress = "Website: " + partner.get('WebAddress');
                            thisShop.Address = "Address: " + partner.get('Address');
                            thisShop.Location = partner.get('Location');
                            console.log(thisShop);
                        },
                        error: function(err) {
                            console.log(err);
                        }

                    })
                } else {
                    thisShop.ShopName = 'Could not find that partner';
                    thisShop.Pending = "";
                    thisShop.Hours = "";
                    thisShop.ContactName = "";
                    thisShop.PhoneNumber = "";
                    thisShop.WebAddress = "";
                    thisShop.Address = "";
                    console.log("coulcn't find partner");
                }

            },
            error: function(partner, err) {
                alert('could not find partner with that email address');
                console.log(err);
            }
        })
    }


    var thisUser = {
        "First": "",
        "Last": "",
        "Email": "",
        "MembershipTier": ""
    };

    var UserQuery = new Parse.Query('User');

    function SearchUsers(email) {
        UserQuery.equalTo('email', email);
        UserQuery.first({
            success: function(user) {
                if (!user) {
                    console.log("coulcn't find user");
                } else {
                    var Tier = user.get('MembershipTier').id;
                    console.log(Tier);
                    var tQ = new Parse.Query("Tier");
                    tQ.equalTo('objectId', Tier);
                    tQ.find({
                        success: function(obj) {
                            var tObj = obj;
                            var userTier = tObj[0].get('level');
                            var userBenefit = tObj[0].get('benefits');
                            var tObj = {
                                "Tier": userTier,
                                "Benefit": userBenefit
                            };
                            thisUser.First = user.get('first');
                            thisUser.Last = user.get('last');
                            thisUser.Email = user.get('email');
                            thisUser.MembershipTier = tObj;
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                }
            },
            error: function(user, err) {
                alert('could not find user with that email address');
                console.log(err);
            }
        })
    }

    return {
        SearchPartners: SearchPartners,
        SearchUsers: SearchUsers,
        thisUser: thisUser,
        thisShop: thisShop
    };
});
