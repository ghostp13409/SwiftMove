import { useEffect, useState } from "react";
import { Plus, Loader2, Minus, Package, Info, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { moveOfferService } from "@/services/moveOfferService";
import { moveRequestService } from "@/services/moveRequestService";
import { addressService } from "@/services/addressService";
import { luggageService } from "@/services/luggageService";
import type {
  MoveRequest,
  MoveRequestPopulated,
  MoveOfferPopulated,
  LuggageType,
} from "@/types";
import { populationFactory } from "@/services/populationFactory";
import { getVehicleString } from "@/utils";

const ClientMoveRequests = () => {
  const { userId } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState<MoveRequestPopulated | null>(null);
  const [myRequests, setMyRequests] = useState<MoveRequestPopulated[]>([]);
  const [offersForRequest, setOffersForRequest] = useState<
    MoveOfferPopulated[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Luggage state
  const [luggageTypes, setLuggageTypes] = useState<LuggageType[]>([]);
  const [luggageQuantities, setLuggageQuantities] = useState<Record<number, number>>({});

  // Form state - Pick-up
  const [fromLine1, setFromLine1] = useState("");
  const [fromLine2, setFromLine2] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [fromState, setFromState] = useState("");
  const [fromCountry, setFromCountry] = useState("Canada");
  const [fromPostal, setFromPostal] = useState("");

  // Form state - Destination
  const [toLine1, setToLine1] = useState("");
  const [toLine2, setToLine2] = useState("");
  const [toCity, setToCity] = useState("");
  const [toState, setToState] = useState("");
  const [toCountry, setToCountry] = useState("Canada");
  const [toPostal, setToPostal] = useState("");

  const [moveDate, setMoveDate] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetchRequests();
    fetchLuggageTypes();
  }, [userId]);

  const fetchRequests = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await moveRequestService.getActiveRequests();
      const populatedMoveRequests = await Promise.all(
        data.map((req) => populationFactory.populateMoveRequest(req))
      );
      setMyRequests(populatedMoveRequests);
    } catch (err) {
      console.error("Failed to load move requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLuggageTypes = async () => {
    try {
      const types = await luggageService.getAllLuggageTypes();
      const sortedTypes = [...types].sort((a, b) => (a.id || 0) - (b.id || 0)).slice(0, 5);
      setLuggageTypes(sortedTypes);
      const initialQuantities: Record<string, number> = {};
      sortedTypes.forEach(t => {
        const key = String(t.id || t.type || t.luggageTypeEnum);
        initialQuantities[key] = 0;
      });
      setLuggageQuantities(initialQuantities);
    } catch (err) {
      console.error("Failed to load luggage types:", err);
    }
  };

  const handleSelectRequest = async (req: MoveRequest) => {
    const popultedMoveRequest =
      await populationFactory.populateMoveRequest(req);
    setSelected(popultedMoveRequest);
    try {
      const offers = await moveOfferService.getOffersByMoveRequest(req.id);
      const populatedOffers = await Promise.all(
        offers.map((offer) => populationFactory.populateMoveOffer(offer)),
      );
      setOffersForRequest(
        Array.isArray(populatedOffers) ? populatedOffers : [],
      );
    } catch {
      setOffersForRequest([]);
    }
  };

  const handleAcceptOffer = async (offerId: number) => {
    try {
      await moveOfferService.acceptOffer(offerId);
      toast({
        title: "Offer Accepted",
        description: "The move offer has been accepted.",
      });
      if (selected) handleSelectRequest(selected);
      fetchRequests();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to accept offer.",
        variant: "destructive",
      });
    }
  };

  const handleRejectOffer = async (offerId: number) => {
    try {
      await moveOfferService.rejectOffer(offerId);
      toast({
        title: "Offer Rejected",
        description: "The move offer has been rejected.",
      });
      if (selected) handleSelectRequest(selected);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject offer.",
        variant: "destructive",
      });
    }
  };

  const updateLuggageQuantity = (id: string | number, delta: number) => {
    const key = String(id);
    setLuggageQuantities(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  const handleEditRequest = (req: MoveRequestPopulated) => {
    setIsEditing(true);
    setCurrentRequestId(req.id);
    
    // Populate form
    setFromLine1(req.fromAddress.line1);
    setFromLine2(req.fromAddress.line2 || "");
    setFromCity(req.fromAddress.city);
    setFromState(req.fromAddress.stateOrProvince);
    setFromCountry(req.fromAddress.country);
    setFromPostal(req.fromAddress.postalOrZipCode);

    setToLine1(req.toAddress.line1);
    setToLine2(req.toAddress.line2 || "");
    setToCity(req.toAddress.city);
    setToState(req.toAddress.stateOrProvince);
    setToCountry(req.toAddress.country);
    setToPostal(req.toAddress.postalOrZipCode);

    // Format date for datetime-local input
    if (req.moveDate) {
      const d = new Date(req.moveDate);
      const formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setMoveDate(formattedDate);
    }
    
    setMaxBudget(String(req.maxBudget));
    
    // Populate luggage
    const newQtys: Record<string, number> = {};
    luggageTypes.forEach(t => {
      const key = String(t.id || t.type || t.luggageTypeEnum);
      const entry = req.luggageEntries?.find(le => le.luggageTypeId === t.id);
      newQtys[key] = entry ? entry.quantity : 0;
    });
    setLuggageQuantities(newQtys);
    
    setDialogOpen(true);
  };

  const handleCancelRequest = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this move request?")) return;
    try {
      await moveRequestService.cancelMoveRequest(id);
      toast({
        title: "Request Cancelled",
        description: "Your move request has been cancelled.",
      });
      fetchRequests();
      setSelected(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to cancel move request.",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (!fromLine1 || !fromCity || !fromState || !fromPostal || 
        !toLine1 || !toCity || !toState || !toPostal || 
        !moveDate || !maxBudget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required move details before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);
    try {
      let reqId = currentRequestId;
      
      const addrDataFrom = {
        line1: fromLine1,
        line2: fromLine2,
        city: fromCity,
        stateOrProvince: fromState,
        country: fromCountry,
        postalOrZipCode: fromPostal,
      };

      const addrDataTo = {
        line1: toLine1,
        line2: toLine2,
        city: toCity,
        stateOrProvince: toState,
        country: toCountry,
        postalOrZipCode: toPostal,
      };

      if (isEditing && selected) {
        // Update existing addresses
        await Promise.all([
          addressService.updateAddress(selected.fromAddressId, addrDataFrom),
          addressService.updateAddress(selected.toAddressId, addrDataTo),
        ]);
        
        // Update move request
        await moveRequestService.updateMoveRequest(currentRequestId!, {
          clientId: userId!,
          fromAddressId: selected.fromAddressId,
          toAddressId: selected.toAddressId,
          moveDate: new Date(moveDate),
          maxBudget: parseFloat(maxBudget),
          status: selected.status as any,
        });
      } else {
        // Create new addresses
        const [fromAddr, toAddr] = await Promise.all([
          addressService.createAddress(addrDataFrom),
          addressService.createAddress(addrDataTo),
        ]);

        // Create new move request
        const newRequest = await moveRequestService.createMoveRequest({
          clientId: userId!,
          fromAddressId: fromAddr.id,
          toAddressId: toAddr.id,
          moveDate: new Date(moveDate),
          maxBudget: parseFloat(maxBudget),
          status: "CREATED",
        });
        reqId = newRequest.id;
      }

      // Sync Luggage
      const luggageEntriesToCreate = Object.entries(luggageQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([key, qty]) => {
          const type = luggageTypes.find(t => String(t.id || t.type || t.luggageTypeEnum) === key);
          
          let existingEntryId = null;
          if (isEditing && selected?.luggageEntries) {
            const existing = selected.luggageEntries.find(le => le.luggageTypeId === type?.id);
            if (existing) existingEntryId = existing.id;
          }

          return {
            id: existingEntryId,
            luggageTypeId: type?.id || 0,
            quantity: qty,
            luggageType: type?.luggageTypeEnum || type?.type,
          };
        });

      if (reqId) {
        await Promise.all(
          luggageEntriesToCreate.map(entry => 
            luggageService.createLuggageEntry(reqId!, entry as any)
          )
        );
      }

      toast({
        title: isEditing ? "Request Updated" : "Request Created",
        description: isEditing ? "Your move request has been updated." : "Your move request has been submitted.",
      });
      setDialogOpen(false);
      resetForm();
      fetchRequests();
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} move request.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentRequestId(null);
    setFromLine1("");
    setFromLine2("");
    setFromCity("");
    setFromState("");
    setFromCountry("Canada");
    setFromPostal("");
    setToLine1("");
    setToLine2("");
    setToCity("");
    setToState("");
    setToCountry("Canada");
    setToPostal("");
    setMoveDate("");
    setMaxBudget("");
    setNotes("");
    const emptyQuantities: Record<string, number> = {};
    luggageTypes.forEach(t => {
      const key = String(t.id || t.type || t.luggageTypeEnum);
      emptyQuantities[key] = 0;
    });
    setLuggageQuantities(emptyQuantities);
    setStep(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Move Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your moving requests
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(val) => {
          setDialogOpen(val);
          if (!val) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gradient-brand text-primary-foreground border-0 gap-2 shadow-lg h-10 px-6 font-semibold">
              <Plus className="w-4 h-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 rounded-[2rem] border-0 shadow-2xl">
            <DialogHeader className="p-6 border-b bg-background">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">Create Move Request</DialogTitle>
                <div className="flex gap-1.5">
                  <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step === 1 ? 'bg-primary' : 'bg-primary/20'}`} />
                  <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step === 2 ? 'bg-primary' : 'bg-primary/20'}`} />
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 overflow-y-auto flex-1 bg-background">
              {step === 1 ? (
                <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                  <div className="space-y-4">
                    {/* Pick-up Address Section */}
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Pick-up Location</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <Input placeholder="Address Line 1" value={fromLine1} onChange={(e) => setFromLine1(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                        <Input placeholder="Apartment, suite, etc. (optional)" value={fromLine2} onChange={(e) => setFromLine2(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="City" value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                          <Input placeholder="Province/State" value={fromState} onChange={(e) => setFromState(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Postal/Zip Code" value={fromPostal} onChange={(e) => setFromPostal(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                          <Input placeholder="Country" value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                        </div>
                      </div>
                    </div>

                    {/* Destination Address Section */}
                    <div className="space-y-3 pt-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Destination</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <Input placeholder="Address Line 1" value={toLine1} onChange={(e) => setToLine1(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                        <Input placeholder="Apartment, suite, etc. (optional)" value={toLine2} onChange={(e) => setToLine2(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="City" value={toCity} onChange={(e) => setToCity(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                          <Input placeholder="Province/State" value={toState} onChange={(e) => setToState(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Postal/Zip Code" value={toPostal} onChange={(e) => setToPostal(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                          <Input placeholder="Country" value={toCountry} onChange={(e) => setToCountry(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Move Date</Label>
                      <Input type="datetime-local" value={moveDate} onChange={(e) => setMoveDate(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Budget ($)</Label>
                      <Input type="number" placeholder="500" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Luggage Items</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/5"
                      onClick={() => setGuideOpen(true)}
                    >
                      <Info className="w-3 h-3" /> Size Guide
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {luggageTypes.map((type) => {
                      const itemKey = String(type.id || type.type || type.luggageTypeEnum);
                      return (
                        <div key={itemKey} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 border border-border/50 group hover:border-primary/30 transition-all">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{type.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{(type.luggageTypeEnum || type.type || "").replace(/_/g, ' ')}</span>
                          </div>
                          <div className="flex items-center gap-3 bg-background/80 rounded-xl p-1 border shadow-sm group-hover:bg-background transition-colors">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => updateLuggageQuantity(itemKey, -1)}
                              disabled={!luggageQuantities[itemKey]}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-bold w-6 text-center">
                              {luggageQuantities[itemKey] || 0}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                              onClick={() => updateLuggageQuantity(itemKey, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Notes (Optional)</Label>
                    <Textarea 
                      placeholder="e.g. Fragile items, tight stairs..." 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      className="mt-2 min-h-[80px] rounded-2xl bg-secondary/30"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-secondary/10 flex gap-3">
              {step === 2 && (
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl font-semibold"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              )}
              {step === 1 ? (
                <Button 
                  className="flex-1 gradient-brand text-primary-foreground h-12 rounded-xl font-bold shadow-lg"
                  onClick={nextStep}
                >
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  className="flex-1 gradient-brand text-primary-foreground h-12 rounded-xl font-bold shadow-lg"
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Submit Request <Check className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Size Guide Dialog */}
        <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
          <DialogContent className="max-w-md rounded-3xl shadow-2xl border-0">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Info className="w-5 h-5 text-primary" />
                Luggage Size Guide
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2 rounded-2xl border border-border/50 overflow-hidden bg-secondary/10">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow className="border-b-border/50">
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Volume</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {luggageTypes.map((t) => (
                    <TableRow key={t.id} className="hover:bg-secondary/20 border-b-border/50 last:border-0 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{t.name}</span>
                          <span className="text-[9px] text-muted-foreground uppercase tracking-tight">{(t.luggageTypeEnum || t.type || "").replace(/_/g, ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm py-4">{t.volume} m³</TableCell>
                      <TableCell className="text-right font-semibold text-sm py-4">{t.weight} kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {myRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No move requests yet.</p>
            ) : (
              myRequests.map((req) => (
                <Card
                  key={req.id}
                  className={`cursor-pointer transition-all hover:shadow-card-lg border-2 ${selected?.id === req.id ? "border-primary bg-primary/5 shadow-md scale-[1.01]" : "border-transparent shadow-card"}`}
                  onClick={() => handleSelectRequest(req)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sm">
                        {req.fromAddress?.city} → {req.toAddress?.city}
                      </p>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> {req.moveDate.toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="font-bold text-foreground">${req.maxBudget}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <Card className="shadow-card overflow-hidden border-0 rounded-[2rem] bg-background">
                <CardHeader className="bg-secondary/10 border-b px-8 py-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      Move Details
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      {(selected.status === "CREATED" || selected.status === "OFFER_AVAILABLE") && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleEditRequest(selected)} className="h-8 px-3 rounded-lg text-xs font-semibold border-primary/30 hover:bg-primary/5">
                            Edit Request
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleCancelRequest(selected.id)} className="h-8 px-3 rounded-lg text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/5">
                            Cancel Request
                          </Button>
                        </>
                      )}
                      <StatusBadge status={selected.status} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.15em]">Origin</p>
                      <div className="p-4 rounded-2xl bg-secondary/20 border border-border/50">
                        <p className="text-sm font-bold">{selected.fromAddress?.line1}</p>
                        {selected.fromAddress?.line2 && <p className="text-xs text-muted-foreground mt-0.5">{selected.fromAddress.line2}</p>}
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{selected.fromAddress?.city}, {selected.fromAddress?.stateOrProvince}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{selected.fromAddress?.postalOrZipCode}, {selected.fromAddress?.country}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.15em]">Destination</p>
                      <div className="p-4 rounded-2xl bg-secondary/20 border border-border/50">
                        <p className="text-sm font-bold">{selected.toAddress?.line1}</p>
                        {selected.toAddress?.line2 && <p className="text-xs text-muted-foreground mt-0.5">{selected.toAddress.line2}</p>}
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{selected.toAddress?.city}, {selected.toAddress?.stateOrProvince}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{selected.toAddress?.postalOrZipCode}, {selected.toAddress?.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 py-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.15em]">Scheduled For</p>
                      <p className="text-base font-bold text-foreground">{selected.moveDate.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.15em]">Estimated Budget</p>
                      <p className="text-2xl font-black text-primary tracking-tight">${selected.maxBudget}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.15em]">Luggage Inventory</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selected.luggageEntries?.length ? (
                        selected.luggageEntries.map((l, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-background border border-border/50 shadow-sm transition-hover hover:border-primary/20">
                            <div className="bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold shadow-sm">
                              {l.quantity}
                            </div>
                            <span className="text-xs font-bold tracking-tight">{l.luggageType?.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic col-span-full">No items listed</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg tracking-tight">Driver Offers <span className="text-primary/50 text-sm ml-1 font-medium">({offersForRequest.length})</span></h3>
                    </div>
                    {offersForRequest.length === 0 ? (
                      <div className="text-center py-12 bg-secondary/10 rounded-3xl border border-dashed border-border/60">
                        <p className="text-sm font-medium text-muted-foreground">Looking for available drivers...</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">Offers will appear here automatically</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {offersForRequest.map((offer) => (
                          <div key={offer.id} className="flex items-center justify-between p-5 rounded-2xl bg-background border shadow-sm hover:border-primary/40 transition-all hover:shadow-lg group">
                            <div className="space-y-1">
                              <p className="text-sm font-bold group-hover:text-primary transition-colors">{offer.driver.user.firstName} {offer.driver.user.lastName}</p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{getVehicleString(offer.vehicle)}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-lg font-black text-primary tracking-tighter">${offer.price}</p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Fixed Price</p>
                              </div>
                              {(selected.status === "CREATED" || selected.status === "OFFER_AVAILABLE") && offer.status === "OFFER_SENT" && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleRejectOffer(offer.id)} className="h-10 px-4 rounded-xl border-destructive text-destructive hover:bg-destructive/5 font-bold shadow-sm">
                                    Reject
                                  </Button>
                                  <Button size="sm" onClick={() => handleAcceptOffer(offer.id)} className="h-10 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-md transition-transform active:scale-95">
                                    Accept
                                  </Button>
                                </div>
                              )}
                              {offer.status !== "OFFER_SENT" && (
                                <StatusBadge status={offer.status} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] opacity-40 bg-secondary/5 border-muted-foreground/20">
                <div className="p-6 rounded-3xl bg-secondary/10 mb-4">
                  <Package className="w-16 h-16 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Select a move to inspect</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientMoveRequests;
